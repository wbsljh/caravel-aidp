import celery
from datetime import datetime
import json
import logging
import pandas as pd
import sqlalchemy
import uuid
import zlib

from sqlalchemy.pool import NullPool
from sqlalchemy.orm import sessionmaker

from superset import (
    app, db, models, utils, dataframe, results_backend)
from superset.db_engine_specs import LimitMethod
from superset.jinja_context import get_template_processor
QueryStatus = models.QueryStatus

celery_app = celery.Celery(config_source=app.config.get('CELERY_CONFIG'))


def is_query_select(sql):
    return sql.upper().startswith('SELECT')


def create_table_as(sql, table_name, schema=None, override=False):
    """Reformats the query into the create table as query.

    Works only for the single select SQL statements, in all other cases
    the sql query is not modified.
    :param sql: string, sql query that will be executed
    :param table_name: string, will contain the results of the query execution
    :param override, boolean, table table_name will be dropped if true
    :return: string, create table as query
    """
    # TODO(bkyryliuk): enforce that all the columns have names. Presto requires it
    #                  for the CTA operation.
    # TODO(bkyryliuk): drop table if allowed, check the namespace and
    #                  the permissions.
    # TODO raise if multi-statement
    if schema:
        table_name = schema + '.' + table_name
    exec_sql = ''
    if is_query_select(sql):
        if override:
            exec_sql = 'DROP TABLE IF EXISTS {table_name};\n'
        exec_sql += "CREATE TABLE {table_name} AS \n{sql}"
    else:
        raise Exception("Could not generate CREATE TABLE statement")
    return exec_sql.format(**locals())


@celery_app.task(bind=True)
def get_sql_results(self, query_id, return_results=True, store_results=False):
    """Executes the sql query returns the results."""
    if not self.request.called_directly:
        engine = sqlalchemy.create_engine(
            app.config.get('SQLALCHEMY_DATABASE_URI'), poolclass=NullPool)
        session_class = sessionmaker()
        session_class.configure(bind=engine)
        session = session_class()
    else:
        session = db.session()
        session.commit()  # HACK
    query = session.query(models.Query).filter_by(id=query_id).one()
    database = query.database
    executed_sql = query.sql.strip().strip(';')
    db_engine_spec = database.db_engine_spec

    def handle_error(msg):
        """Local method handling error while processing the SQL"""
        query.error_message = msg
        query.status = QueryStatus.FAILED
        query.tmp_table_name = None
        session.commit()
        raise Exception(query.error_message)

    # Limit enforced only for retrieving the data, not for the CTA queries.
    is_select = is_query_select(executed_sql);
    if not is_select and not database.allow_dml:
        handle_error(
            "Only `SELECT` statements are allowed against this database")
    if query.select_as_cta:
        if not is_select:
            handle_error(
                "Only `SELECT` statements can be used with the CREATE TABLE "
                "feature.")
        if not query.tmp_table_name:
            start_dttm = datetime.fromtimestamp(query.start_time)
            query.tmp_table_name = 'tmp_{}_table_{}'.format(
                query.user_id,
                start_dttm.strftime('%Y_%m_%d_%H_%M_%S'))
        executed_sql = create_table_as(
            executed_sql, query.tmp_table_name, database.force_ctas_schema)
        query.select_as_cta_used = True
    elif (
            query.limit and is_select and
            db_engine_spec.limit_method == LimitMethod.WRAP_SQL):
        executed_sql = database.wrap_sql_limit(executed_sql, query.limit)
        query.limit_used = True
    engine = database.get_sqla_engine(schema=query.schema)
    try:
        template_processor = get_template_processor(
            database=database, query=query)
        executed_sql = template_processor.process_template(executed_sql)
    except Exception as e:
        logging.exception(e)
        msg = "Template rendering failed: " + utils.error_msg_from_exception(e)
        handle_error(msg)
    try:
        query.executed_sql = executed_sql
        logging.info("Running query: \n{}".format(executed_sql))
        result_proxy = engine.execute(query.executed_sql, schema=query.schema)
    except Exception as e:
        logging.exception(e)
        handle_error(utils.error_msg_from_exception(e))

    cursor = result_proxy.cursor
    query.status = QueryStatus.RUNNING
    session.flush()
    db_engine_spec.handle_cursor(cursor, query, session)

    cdf = None
    if result_proxy.cursor:
        column_names = [col[0] for col in result_proxy.cursor.description]
        if db_engine_spec.limit_method == LimitMethod.FETCH_MANY:
            data = result_proxy.fetchmany(query.limit)
        else:
            data = result_proxy.fetchall()
        cdf = dataframe.SupersetDataFrame(
            pd.DataFrame(data, columns=column_names))

    query.rows = result_proxy.rowcount
    query.progress = 100
    query.status = QueryStatus.SUCCESS
    if query.rows == -1 and cdf:
        # Presto doesn't provide result_proxy.row_count
        query.rows = cdf.size
    if query.select_as_cta:
        query.select_sql = '{}'.format(database.select_star(
            query.tmp_table_name, limit=query.limit))
    query.end_time = utils.now_as_float()
    session.flush()

    payload = {
        'query_id': query.id,
        'status': query.status,
        'data': [],
    }
    payload['data'] = cdf.data if cdf else []
    payload['columns'] = cdf.columns_dict if cdf else []
    payload['query'] = query.to_dict()
    payload = json.dumps(payload, default=utils.json_iso_dttm_ser)

    if store_results and results_backend:
        key = '{}'.format(uuid.uuid4())
        logging.info("Storing results in results backend, key: {}".format(key))
        results_backend.set(key, zlib.compress(payload))
        query.results_key = key

    session.flush()
    session.commit()

    if return_results:
        return payload
