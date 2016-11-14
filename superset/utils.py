"""Utility functions used across Superset"""
from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
from __future__ import unicode_literals

from builtins import object
from datetime import date, datetime, timedelta
import decimal
import functools
import json
import logging
import pytz
import numpy
import signal
import uuid
import re

from sqlalchemy import event, exc
import parsedatetime
import sqlalchemy as sa
from dateutil.parser import parse
from flask import flash, Markup
from flask_appbuilder.security.sqla import models as ab_models
import markdown as md
from sqlalchemy.types import TypeDecorator, TEXT
from pydruid.utils.having import Having

logging.getLogger('MARKDOWN').setLevel(logging.INFO)


EPOCH = datetime(1970, 1, 1)


class SupersetException(Exception):
    pass


class SupersetTimeoutException(SupersetException):
    pass


class SupersetSecurityException(SupersetException):
    pass


class MetricPermException(SupersetException):
    pass


class NoDataException(SupersetException):
    pass


class SupersetTemplateException(SupersetException):
    pass

class ExpressionException(Exception):
    pass


def can_access(security_manager, permission_name, view_name):
    """Protecting from has_access failing from missing perms/view"""
    try:
        return security_manager.has_access(permission_name, view_name)
    except:
        pass
    return False


def flasher(msg, severity=None):
    """Flask's flash if available, logging call if not"""
    try:
        flash(msg, severity)
    except RuntimeError:
        if severity == 'danger':
            logging.error(msg)
        else:
            logging.info(msg)


class memoized(object):  # noqa

    """Decorator that caches a function's return value each time it is called

    If called later with the same arguments, the cached value is returned, and
    not re-evaluated.
    """

    def __init__(self, func):
        self.func = func
        self.cache = {}

    def __call__(self, *args):
        try:
            return self.cache[args]
        except KeyError:
            value = self.func(*args)
            self.cache[args] = value
            return value
        except TypeError:
            # uncachable -- for instance, passing a list as an argument.
            # Better to not cache than to blow up entirely.
            return self.func(*args)

    def __repr__(self):
        """Return the function's docstring."""
        return self.func.__doc__

    def __get__(self, obj, objtype):
        """Support instance methods."""
        return functools.partial(self.__call__, obj)


def get_or_create_main_db(superset):
    db = superset.db
    config = superset.app.config
    DB = superset.models.Database
    logging.info("Creating database reference")
    dbobj = db.session.query(DB).filter_by(database_name='main').first()
    if not dbobj:
        dbobj = DB(database_name="main")
    logging.info(config.get("SQLALCHEMY_DATABASE_URI"))
    dbobj.set_sqlalchemy_uri(config.get("SQLALCHEMY_DATABASE_URI"))
    dbobj.expose_in_sqllab = True
    dbobj.allow_run_sync = True
    db.session.add(dbobj)
    db.session.commit()
    return dbobj


class DimSelector(Having):
    def __init__(self, **args):
        # Just a hack to prevent any exceptions
        Having.__init__(self, type='equalTo', aggregation=None, value=None)

        self.having = {'having': {
            'type': 'dimSelector',
            'dimension': args['dimension'],
            'value': args['value'],
        }}


def list_minus(l, minus):
    """Returns l without what is in minus

    >>> list_minus([1, 2, 3], [2])
    [1, 3]
    """
    return [o for o in l if o not in minus]


def parse_human_datetime(s):
    """
    Returns ``datetime.datetime`` from human readable strings

    >>> from datetime import date, timedelta
    >>> from dateutil.relativedelta import relativedelta
    >>> parse_human_datetime('2015-04-03')
    datetime.datetime(2015, 4, 3, 0, 0)
    >>> parse_human_datetime('2/3/1969')
    datetime.datetime(1969, 2, 3, 0, 0)
    >>> parse_human_datetime("now") <= datetime.now()
    True
    >>> parse_human_datetime("yesterday") <= datetime.now()
    True
    >>> date.today() - timedelta(1) == parse_human_datetime('yesterday').date()
    True
    >>> year_ago_1 = parse_human_datetime('one year ago').date()
    >>> year_ago_2 = (datetime.now() - relativedelta(years=1) ).date()
    >>> year_ago_1 == year_ago_2
    True
    """
    try:
        dttm = parse(s)
    except Exception:
        try:
            cal = parsedatetime.Calendar()
            dttm = dttm_from_timtuple(cal.parse(s)[0])
        except Exception as e:
            logging.exception(e)
            raise ValueError("Couldn't parse date string [{}]".format(s))
    return dttm


def dttm_from_timtuple(d):
    return datetime(
        d.tm_year, d.tm_mon, d.tm_mday, d.tm_hour, d.tm_min, d.tm_sec)


def merge_perm(sm, permission_name, view_menu_name):
    pv = sm.find_permission_view_menu(permission_name, view_menu_name)
    if not pv:
        sm.add_permission_view_menu(permission_name, view_menu_name)


def parse_human_timedelta(s):
    """
    Returns ``datetime.datetime`` from natural language time deltas

    >>> parse_human_datetime("now") <= datetime.now()
    True
    """
    cal = parsedatetime.Calendar()
    dttm = dttm_from_timtuple(datetime.now().timetuple())
    d = cal.parse(s, dttm)[0]
    d = datetime(
        d.tm_year, d.tm_mon, d.tm_mday, d.tm_hour, d.tm_min, d.tm_sec)
    return d - dttm


class JSONEncodedDict(TypeDecorator):

    """Represents an immutable structure as a json-encoded string."""

    impl = TEXT

    def process_bind_param(self, value, dialect):
        if value is not None:
            value = json.dumps(value)

        return value

    def process_result_value(self, value, dialect):
        if value is not None:
            value = json.loads(value)
        return value


def init(superset):
    """Inits the Superset application with security roles and such"""
    ADMIN_ONLY_VIEW_MENUES = set([
        'ResetPasswordView',
        'RoleModelView',
        'Security',
        'UserDBModelView',
        'SQL Lab',
        'AccessRequestsModelView',
        'Manage',
    ])

    ADMIN_ONLY_PERMISSIONS = set([
        'can_sync_druid_source',
        'can_override_role_permissions',
        'can_approve',
    ])

    ALPHA_ONLY_PERMISSIONS = set([
        'all_datasource_access',
        'can_add',
        'can_download',
        'can_delete',
        'can_edit',
        'can_save',
        'datasource_access',
        'database_access',
        'muldelete',
    ])

    db = superset.db
    models = superset.models
    config = superset.app.config
    sm = superset.appbuilder.sm
    alpha = sm.add_role("Alpha")
    admin = sm.add_role("Admin")
    get_or_create_main_db(superset)

    merge_perm(sm, 'all_datasource_access', 'all_datasource_access')

    perms = db.session.query(ab_models.PermissionView).all()
    # set alpha and admin permissions
    for perm in perms:
        if (
                perm.permission and
                perm.permission.name in ('datasource_access', 'database_access')):
            continue
        if (
                perm.view_menu and
                perm.view_menu.name not in ADMIN_ONLY_VIEW_MENUES and
                perm.permission and
                perm.permission.name not in ADMIN_ONLY_PERMISSIONS):

            sm.add_permission_role(alpha, perm)
        sm.add_permission_role(admin, perm)

    gamma = sm.add_role("Gamma")
    public_role = sm.find_role("Public")
    public_role_like_gamma = \
        public_role and config.get('PUBLIC_ROLE_LIKE_GAMMA', False)

    # set gamma permissions
    for perm in perms:
        if (
                perm.view_menu and
                perm.view_menu.name not in ADMIN_ONLY_VIEW_MENUES and
                perm.permission and
                perm.permission.name not in ADMIN_ONLY_PERMISSIONS and
                perm.permission.name not in ALPHA_ONLY_PERMISSIONS):
            sm.add_permission_role(gamma, perm)
            if public_role_like_gamma:
                sm.add_permission_role(public_role, perm)
    session = db.session()
    table_perms = [
        table.perm for table in session.query(models.SqlaTable).all()]
    table_perms += [
        table.perm for table in session.query(models.DruidDatasource).all()]
    for table_perm in table_perms:
        merge_perm(sm, 'datasource_access', table_perm)

    db_perms = [db.perm for db in session.query(models.Database).all()]
    for db_perm in db_perms:
        merge_perm(sm, 'database_access', db_perm)
    init_metrics_perm(superset)


def init_metrics_perm(superset, metrics=None):
    """Create permissions for restricted metrics

    :param metrics: a list of metrics to be processed, if not specified,
        all metrics are processed
    :type metrics: models.SqlMetric or models.DruidMetric
    """
    db = superset.db
    models = superset.models
    sm = superset.appbuilder.sm

    if not metrics:
        metrics = []
        for model in [models.SqlMetric, models.DruidMetric]:
            metrics += list(db.session.query(model).all())

    for metric in metrics:
        if metric.is_restricted and metric.perm:
            merge_perm(sm, 'metric_access', metric.perm)


def datetime_f(dttm):
    """Formats datetime to take less room when it is recent"""
    if dttm:
        dttm = dttm.isoformat()
        now_iso = datetime.now().isoformat()
        if now_iso[:10] == dttm[:10]:
            dttm = dttm[11:]
        elif now_iso[:4] == dttm[:4]:
            dttm = dttm[5:]
    return "<nobr>{}</nobr>".format(dttm)


def base_json_conv(obj):

    if isinstance(obj, numpy.int64):
        return int(obj)
    elif isinstance(obj, set):
        return list(obj)
    elif isinstance(obj, decimal.Decimal):
        return float(obj)
    elif isinstance(obj, uuid.UUID):
        return str(obj)


def json_iso_dttm_ser(obj):
    """
    json serializer that deals with dates

    >>> dttm = datetime(1970, 1, 1)
    >>> json.dumps({'dttm': dttm}, default=json_iso_dttm_ser)
    '{"dttm": "1970-01-01T00:00:00"}'
    """
    val = base_json_conv(obj)
    if val is not None:
        return val
    if isinstance(obj, datetime):
        obj = obj.isoformat()
    elif isinstance(obj, date):
        obj = obj.isoformat()
    else:
        raise TypeError(
            "Unserializable object {} of type {}".format(obj, type(obj))
        )
    return obj


def datetime_to_epoch(dttm):
    if dttm.tzinfo:
        epoch_with_tz = pytz.utc.localize(EPOCH)
        return (dttm - epoch_with_tz).total_seconds() * 1000
    return (dttm - EPOCH).total_seconds() * 1000


def now_as_float():
    return datetime_to_epoch(datetime.utcnow())


def json_int_dttm_ser(obj):
    """json serializer that deals with dates"""
    val = base_json_conv(obj)
    if val is not None:
        return val
    if isinstance(obj, datetime):
        obj = datetime_to_epoch(obj)
    elif isinstance(obj, date):
        obj = (obj - EPOCH.date()).total_seconds() * 1000
    else:
        raise TypeError(
            "Unserializable object {} of type {}".format(obj, type(obj))
        )
    return obj


def error_msg_from_exception(e):
    """Translate exception into error message

    Database have different ways to handle exception. This function attempts
    to make sense of the exception object and construct a human readable
    sentence.

    TODO(bkyryliuk): parse the Presto error message from the connection
                     created via create_engine.
    engine = create_engine('presto://localhost:3506/silver') -
      gives an e.message as the str(dict)
    presto.connect("localhost", port=3506, catalog='silver') - as a dict.
    The latter version is parsed correctly by this function.
    """
    msg = ''
    if hasattr(e, 'message'):
        if type(e.message) is dict:
            msg = e.message.get('message')
        elif e.message:
            msg = "{}".format(e.message)
    return msg or '{}'.format(e)


def markdown(s, markup_wrap=False):
    s = md.markdown(s or '', [
        'markdown.extensions.tables',
        'markdown.extensions.fenced_code',
        'markdown.extensions.codehilite',
    ])
    if markup_wrap:
        s = Markup(s)
    return s


def readfile(filepath):
    with open(filepath) as f:
        content = f.read()
    return content


def generic_find_constraint_name(table, columns, referenced, db):
    """Utility to find a constraint name in alembic migrations"""
    t = sa.Table(table, db.metadata, autoload=True, autoload_with=db.engine)

    for fk in t.foreign_key_constraints:
        if (
                fk.referred_table.name == referenced and
                set(fk.column_keys) == columns):
            return fk.name


def get_datasource_full_name(database_name, datasource_name, schema=None):
    if not schema:
        return "[{}].[{}]".format(database_name, datasource_name)
    return "[{}].[{}].[{}]".format(database_name, schema, datasource_name)


def validate_json(obj):
    if obj:
        try:
            json.loads(obj)
        except Exception:
            raise SupersetException("JSON is not valid")


def table_has_constraint(table, name, db):
    """Utility to find a constraint name in alembic migrations"""
    t = sa.Table(table, db.metadata, autoload=True, autoload_with=db.engine)

    for c in t.constraints:
        if c.name == name:
            return True
    return False


class timeout(object):
    """
    To be used in a ``with`` block and timeout its content.
    """
    def __init__(self, seconds=1, error_message='Timeout'):
        self.seconds = seconds
        self.error_message = error_message

    def handle_timeout(self, signum, frame):
        logging.error("Process timed out")
        raise SupersetTimeoutException(self.error_message)

    def __enter__(self):
        try:
            signal.signal(signal.SIGALRM, self.handle_timeout)
            signal.alarm(self.seconds)
        except ValueError as e:
            logging.warning("timeout can't be used in the current context")
            logging.exception(e)

    def __exit__(self, type, value, traceback):
        try:
            signal.alarm(0)
        except ValueError as e:
            logging.warning("timeout can't be used in the current context")
            logging.exception(e)

class ExpressionDecoder(object):

    REGEXP = '\{\$([(a-z)|(A-Z)|\-|\+|\d]+)\}'

    TODAY = date.today()
    CUR_YEAR = TODAY.year
    CUR_MONTH = TODAY.month
    CUR_DAY = TODAY.day
    CUR_QUARTER = CUR_MONTH / 4 + 1

    EXP_PREFIX = '{$'
    EXP_SUFFIX = '}'

    def __init__(self, raw_str):
        self.raw_str = raw_str
        self.out_str = raw_str
        # pattern = re.compile(REGEXP)
        self.var_list = re.findall(self.REGEXP, self.raw_str)

    def decode(self):
        for var in self.var_list:
            self.out_str = self.out_str.replace('%s%s%s'%(self.EXP_PREFIX, var, self.EXP_SUFFIX), self._parse(var))
        return self.out_str

    def _parse(self, var):
        var_opr = re.findall('[+-]', var)[0]
        var_param = var.split('+') if var_opr == '+' else var.split('-')
        if var_param[0] == 'year':
            value = self.CUR_YEAR + int(var_param[1]) if var_opr == '+' else self.CUR_YEAR - int(var_param[1])
        elif var_param[0] == 'quarter':
            m = self.CUR_QUARTER + int(var_param[1]) if var_opr == '+' else self.CUR_QUARTER - int(var_param[1])
            y = self.CUR_YEAR
            l = 4
            # if m <= 0:
            while m <= 0:
                m = m + l
                y = y - 1
            # if m > l:
            while m > l:
                m = m - l
                y = y + 1
            value = '%s%02d'%(y, m)
        elif var_param[0] == 'month':
            m = self.CUR_MONTH + int(var_param[1]) if var_opr == '+' else self.CUR_MONTH - int(var_param[1])
            y = self.CUR_YEAR
            l = 12
            # if m <= 0:
            while m <= 0:
                m = m + l
                y = y - 1
            # if m > l:
            while m > l:
                m = m - l
                y = y + 1
            value = '%s%02d'%(y, m)
        elif var_param[0] == 'day':
            value = self.TODAY + timedelta(days = int(var_param[1])) if \
            var_opr == '+' else self.TODAY - timedelta(days = int(var_param[1]))
            value = value.strftime('%Y%m%d')
        else:
            raise ExpressionException('expression error')
        return value

def wrap_clause_in_parens(sql):
    """Wrap where/having clause with parenthesis if necessary"""
    if sql.strip():
        sql = '({})'.format(sql)
    return sa.text(sql)


def pessimistic_connection_handling(target):
    @event.listens_for(target, "checkout")
    def ping_connection(dbapi_connection, connection_record, connection_proxy):
        """
        Disconnect Handling - Pessimistic, taken from:
        http://docs.sqlalchemy.org/en/rel_0_9/core/pooling.html
        """
        cursor = dbapi_connection.cursor()
        try:
            cursor.execute("SELECT 1")
        except:
            raise exc.DisconnectionError()
        cursor.close()
