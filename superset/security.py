# -*- coding: utf-8 -*-

import logging
import flask
from flask import redirect
from flask_appbuilder.security.views import UserDBModelView, AuthView
from flask_appbuilder.security.sqla.manager import SecurityManager
from flask.ext.appbuilder.actions import action
from flask.ext.appbuilder import expose
from flask import flash, redirect, session, url_for, request, g, make_response, jsonify, abort
from flask.ext.cas import login
from flask.ext.cas import logout
from flask import current_app
from flask_appbuilder.security.sqla.models import User
from flask_login import login_user, logout_user, current_user

log = logging.getLogger(__name__)

class CustomAuthDBView(AuthView):

    @expose('/cas/', methods=['GET', 'POST'])
    def cas(self):
        cas_token_session_key = current_app.config['CAS_TOKEN_SESSION_KEY']
        cas_token_session_value = flask.session[cas_token_session_key]
        log.debug('call from cas server')
        user = self.appbuilder.sm.load_user(None)
        if user is not None:
            login_user(user, remember=False, force=True)
        return redirect(self.appbuilder.get_url_for_index)


    @expose('/login/', methods=['GET', 'POST'])
    def login(self):
        if g.user is not None and g.user.is_authenticated():
            log.debug('user has login {0}'.format(g.user))
            return redirect('/')
        return login()

    @expose('/logout/')
    def logout(self):
        current_app.config['CAS_AFTER_LOGOUT'] = flask.url_for(
            current_app.config['CAS_AFTER_LOGOUT_TEMP'], _external=True)
        return logout()

    @expose('/cas/afterlogout/', methods=['GET', 'POST'])
    def cas_logout(self):
        logout_user()
        return redirect(self.appbuilder.get_url_for_index)

class CustomSecurityManager(SecurityManager):
    authdbview = CustomAuthDBView

    def get_all_permision_view(self):
        permissionview_list = []
        permissions = [
            {"viewmenu": "ResetPasswordView", "permission": "can_this_form_get"},
            {"viewmenu": "ResetPasswordView", "permission": "can_this_form_post"},
            {"viewmenu": "ResetMyPasswordView", "permission": "can_this_form_post"},
            {"viewmenu": "ResetMyPasswordView", "permission": "can_this_form_get"},
            {"viewmenu": "UserInfoEditView", "permission": "can_this_form_post"},
            {"viewmenu": "UserInfoEditView", "permission": "can_this_form_get"},
            {"viewmenu": "UserDBModelView", "permission": "can_edit"},
            {"viewmenu": "UserDBModelView", "permission": "can_add"},
            {"viewmenu": "UserDBModelView", "permission": "can_download"},
            {"viewmenu": "UserDBModelView", "permission": "resetpasswords"},
            {"viewmenu": "UserDBModelView", "permission": "can_userinfo"},
            {"viewmenu": "UserDBModelView", "permission": "can_show"},
            {"viewmenu": "UserDBModelView", "permission": "can_list"},
            {"viewmenu": "UserDBModelView", "permission": "userinfoedit"},
            {"viewmenu": "UserDBModelView", "permission": "can_delete"},
            {"viewmenu": "UserDBModelView", "permission": "resetmypassword"},
            {"viewmenu": "List Users", "permission": "menu_access"},
            {"viewmenu": "Security", "permission": "menu_access"},
            {"viewmenu": "RoleModelView", "permission": "can_edit"},
            {"viewmenu": "RoleModelView", "permission": "can_show"},
            {"viewmenu": "RoleModelView", "permission": "can_list"},
            {"viewmenu": "RoleModelView", "permission": "can_delete"},
            {"viewmenu": "RoleModelView", "permission": "CopyRole"},
            {"viewmenu": "RoleModelView", "permission": "can_add"},
            {"viewmenu": "RoleModelView", "permission": "can_download"},
            {"viewmenu": "List Roles", "permission": "menu_access"},
            {"viewmenu": "UserStatsChartView", "permission": "can_chart"},
            {"viewmenu": "User's Statistics", "permission": "menu_access"},
            {"viewmenu": "PermissionModelView", "permission": "can_list"},
            {"viewmenu": "Base Permissions", "permission": "menu_access"},
            {"viewmenu": "ViewMenuModelView", "permission": "can_list"},
            {"viewmenu": "Views/Menus", "permission": "menu_access"},
            {"viewmenu": "PermissionViewModelView", "permission": "can_list"},
            {"viewmenu": "Permission on Views/Menus", "permission": "menu_access"},
            {"viewmenu": "TableColumnInlineView", "permission": "can_add"},
            {"viewmenu": "TableColumnInlineView", "permission": "can_download"},
            {"viewmenu": "TableColumnInlineView", "permission": "can_edit"},
            {"viewmenu": "TableColumnInlineView", "permission": "can_show"},
            {"viewmenu": "TableColumnInlineView", "permission": "can_list"},
            {"viewmenu": "TableColumnInlineView", "permission": "can_delete"},
            {"viewmenu": "DruidColumnInlineView", "permission": "can_list"},
            {"viewmenu": "DruidColumnInlineView", "permission": "can_delete"},
            {"viewmenu": "DruidColumnInlineView", "permission": "can_add"},
            {"viewmenu": "DruidColumnInlineView", "permission": "can_download"},
            {"viewmenu": "DruidColumnInlineView", "permission": "can_edit"},
            {"viewmenu": "DruidColumnInlineView", "permission": "can_show"},
            {"viewmenu": "SqlMetricInlineView", "permission": "can_add"},
            {"viewmenu": "SqlMetricInlineView", "permission": "can_download"},
            {"viewmenu": "SqlMetricInlineView", "permission": "can_edit"},
            {"viewmenu": "SqlMetricInlineView", "permission": "can_show"},
            {"viewmenu": "SqlMetricInlineView", "permission": "can_list"},
            {"viewmenu": "SqlMetricInlineView", "permission": "can_delete"},
            {"viewmenu": "DruidMetricInlineView", "permission": "can_list"},
            {"viewmenu": "DruidMetricInlineView", "permission": "can_delete"},
            {"viewmenu": "DruidMetricInlineView", "permission": "can_add"},
            {"viewmenu": "DruidMetricInlineView", "permission": "can_download"},
            {"viewmenu": "DruidMetricInlineView", "permission": "can_edit"},
            {"viewmenu": "DruidMetricInlineView", "permission": "can_show"},
            {"viewmenu": "DatabaseView", "permission": "can_download"},
            {"viewmenu": "DatabaseView", "permission": "can_edit"},
            {"viewmenu": "DatabaseView", "permission": "can_show"},
            {"viewmenu": "DatabaseView", "permission": "can_list"},
            {"viewmenu": "DatabaseView", "permission": "can_delete"},
            {"viewmenu": "DatabaseView", "permission": "muldelete"},
            {"viewmenu": "DatabaseView", "permission": "can_add"},
            {"viewmenu": "Databases", "permission": "menu_access"},
            {"viewmenu": "Sources", "permission": "menu_access"},
            {"viewmenu": "DatabaseAsync", "permission": "can_list"},
            {"viewmenu": "DatabaseAsync", "permission": "can_delete"},
            {"viewmenu": "DatabaseAsync", "permission": "muldelete"},
            {"viewmenu": "DatabaseAsync", "permission": "can_add"},
            {"viewmenu": "DatabaseAsync", "permission": "can_download"},
            {"viewmenu": "DatabaseAsync", "permission": "can_edit"},
            {"viewmenu": "DatabaseAsync", "permission": "can_show"},
            {"viewmenu": "DatabaseTablesAsync", "permission": "can_delete"},
            {"viewmenu": "DatabaseTablesAsync", "permission": "muldelete"},
            {"viewmenu": "DatabaseTablesAsync", "permission": "can_add"},
            {"viewmenu": "DatabaseTablesAsync", "permission": "can_download"},
            {"viewmenu": "DatabaseTablesAsync", "permission": "can_edit"},
            {"viewmenu": "DatabaseTablesAsync", "permission": "can_show"},
            {"viewmenu": "DatabaseTablesAsync", "permission": "can_list"},
            {"viewmenu": "TableModelView", "permission": "can_delete"},
            {"viewmenu": "TableModelView", "permission": "muldelete"},
            {"viewmenu": "TableModelView", "permission": "can_add"},
            {"viewmenu": "TableModelView", "permission": "can_download"},
            {"viewmenu": "TableModelView", "permission": "can_edit"},
            {"viewmenu": "TableModelView", "permission": "can_show"},
            {"viewmenu": "TableModelView", "permission": "can_list"},
            {"viewmenu": "Tables", "permission": "menu_access"},
            {"viewmenu": "DruidClusterModelView", "permission": "can_list"},
            {"viewmenu": "DruidClusterModelView", "permission": "can_delete"},
            {"viewmenu": "DruidClusterModelView", "permission": "muldelete"},
            {"viewmenu": "DruidClusterModelView", "permission": "can_add"},
            {"viewmenu": "DruidClusterModelView", "permission": "can_download"},
            {"viewmenu": "DruidClusterModelView", "permission": "can_edit"},
            {"viewmenu": "DruidClusterModelView", "permission": "can_show"},
            {"viewmenu": "Druid Clusters", "permission": "menu_access"},
            {"viewmenu": "SliceModelView", "permission": "can_edit"},
            {"viewmenu": "SliceModelView", "permission": "can_show"},
            {"viewmenu": "SliceModelView", "permission": "can_list"},
            {"viewmenu": "SliceModelView", "permission": "can_delete"},
            {"viewmenu": "SliceModelView", "permission": "muldelete"},
            {"viewmenu": "SliceModelView", "permission": "can_add"},
            {"viewmenu": "SliceModelView", "permission": "can_download"},
            {"viewmenu": "Slices", "permission": "menu_access"},
            {"viewmenu": "SliceAsync", "permission": "can_download"},
            {"viewmenu": "SliceAsync", "permission": "can_edit"},
            {"viewmenu": "SliceAsync", "permission": "can_show"},
            {"viewmenu": "SliceAsync", "permission": "can_list"},
            {"viewmenu": "SliceAsync", "permission": "can_delete"},
            {"viewmenu": "SliceAsync", "permission": "muldelete"},
            {"viewmenu": "SliceAsync", "permission": "can_add"},
            {"viewmenu": "SliceAddView", "permission": "can_download"},
            {"viewmenu": "SliceAddView", "permission": "can_edit"},
            {"viewmenu": "SliceAddView", "permission": "can_show"},
            {"viewmenu": "SliceAddView", "permission": "can_list"},
            {"viewmenu": "SliceAddView", "permission": "can_delete"},
            {"viewmenu": "SliceAddView", "permission": "muldelete"},
            {"viewmenu": "SliceAddView", "permission": "can_add"},
            {"viewmenu": "DashboardModelView", "permission": "can_edit"},
            {"viewmenu": "DashboardModelView", "permission": "can_show"},
            {"viewmenu": "DashboardModelView", "permission": "can_list"},
            {"viewmenu": "DashboardModelView", "permission": "can_delete"},
            {"viewmenu": "DashboardModelView", "permission": "muldelete"},
            {"viewmenu": "DashboardModelView", "permission": "can_add"},
            {"viewmenu": "DashboardModelView", "permission": "can_download"},
            {"viewmenu": "Dashboards", "permission": "menu_access"},
            {"viewmenu": "DashboardModelViewAsync", "permission": "can_download"},
            {"viewmenu": "DashboardModelViewAsync", "permission": "can_edit"},
            {"viewmenu": "DashboardModelViewAsync", "permission": "can_show"},
            {"viewmenu": "DashboardModelViewAsync", "permission": "can_list"},
            {"viewmenu": "DashboardModelViewAsync", "permission": "can_delete"},
            {"viewmenu": "DashboardModelViewAsync", "permission": "muldelete"},
            {"viewmenu": "DashboardModelViewAsync", "permission": "can_add"},
            {"viewmenu": "LogModelView", "permission": "can_edit"},
            {"viewmenu": "LogModelView", "permission": "can_show"},
            {"viewmenu": "LogModelView", "permission": "can_list"},
            {"viewmenu": "LogModelView", "permission": "can_delete"},
            {"viewmenu": "LogModelView", "permission": "can_add"},
            {"viewmenu": "LogModelView", "permission": "can_download"},
            {"viewmenu": "Action Log", "permission": "menu_access"},
            {"viewmenu": "DruidDatasourceModelView", "permission": "can_show"},
            {"viewmenu": "DruidDatasourceModelView", "permission": "can_list"},
            {"viewmenu": "DruidDatasourceModelView", "permission": "can_delete"},
            {"viewmenu": "DruidDatasourceModelView", "permission": "muldelete"},
            {"viewmenu": "DruidDatasourceModelView", "permission": "can_add"},
            {"viewmenu": "DruidDatasourceModelView", "permission": "can_download"},
            {"viewmenu": "DruidDatasourceModelView", "permission": "can_edit"},
            {"viewmenu": "Druid Datasources", "permission": "menu_access"},
            {"viewmenu": "Superset", "permission": "can_select_star"},
            {"viewmenu": "Superset", "permission": "can_explore"},
            {"viewmenu": "Superset", "permission": "can_slice"},
            {"viewmenu": "Superset", "permission": "can_refresh_datasources"},
            {"viewmenu": "Superset", "permission": "can_checkbox"},
            {"viewmenu": "Superset", "permission": "can_activity_per_day"},
            {"viewmenu": "Superset", "permission": "can_sql"},
            {"viewmenu": "Superset", "permission": "can_welcome"},
            {"viewmenu": "Superset", "permission": "can_runsql"},
            {"viewmenu": "Superset", "permission": "can_dashboard"},
            {"viewmenu": "Superset", "permission": "can_save_dash"},
            {"viewmenu": "Superset", "permission": "can_table"},
            {"viewmenu": "Superset", "permission": "can_testconn"},
            {"viewmenu": "Refresh Druid Metadata", "permission": "menu_access"},
            {"viewmenu": "CssTemplateModelView", "permission": "can_edit"},
            {"viewmenu": "CssTemplateModelView", "permission": "can_show"},
            {"viewmenu": "CssTemplateModelView", "permission": "can_list"},
            {"viewmenu": "CssTemplateModelView", "permission": "can_delete"},
            {"viewmenu": "CssTemplateModelView", "permission": "muldelete"},
            {"viewmenu": "CssTemplateModelView", "permission": "can_add"},
            {"viewmenu": "CssTemplateModelView", "permission": "can_download"},
            {"viewmenu": "CSS Templates", "permission": "menu_access"},
            {"viewmenu": "all_datasource_access", "permission": "all_datasource_access"},
            {"viewmenu": "MyView1", "permission": "can_method3"},
            {"viewmenu": "MyView1", "permission": "can_method2"},
            {"viewmenu": "MyView1", "permission": "can_method1"},
            {"viewmenu": "Method1", "permission": "menu_access"},
            {"viewmenu": "MyView", "permission": "menu_access"},
            {"viewmenu": "Method2", "permission": "menu_access"},
            {"viewmenu": "Method3", "permission": "menu_access"},
        ]

        for _item in permissions:
            viewmenu = self.viewmenu_model()
            viewmenu.name = _item.get("viewmenu")

            permission = self.permission_model()
            permission.name = _item.get("permission")

            permissionview = self.permissionview_model()
            permissionview.view_menu = viewmenu
            permissionview.permission = permission

            permissionview_list.append(permissionview)
        return permissionview_list
        # return self.get_session.query(self.permissionview_model).all()


    def _buildUser(self, username, attributes):
        with self.get_session.no_autoflush:
            user = self.user_model()
            user.id = attributes['cas:userId']
            user.username = username
            user.first_name = username
            user.last_name = username
            user.active = True
            # init role
            role = self.role_model()
            role.id = 0
            role.name = "General"
            # init permision
            permisions = self.get_all_permision_view()
            for permision in permisions:
                role.permissions.append(permision)

            user.roles.append(role)
            return user

    """
    根据pk来加载用户信息， 这里不用pk, 直接从session中获取， 用户cas单点登入
    """
    def load_user(self, pk):
        # return self.get_user_by_id(int(pk))
        cas_username_session_key = current_app.config['CAS_USERNAME_SESSION_KEY']
        cas_attributes_session_key = current_app.config['CAS_ATTRIBUTES_SESSION_KEY']
        if cas_username_session_key in flask.session and \
                        cas_attributes_session_key in flask.session:
            username = flask.session[cas_username_session_key]
            attributes = flask.session[cas_attributes_session_key]
            return self._buildUser(username, attributes)
        else:
            return None

    # def add_user(self, username, first_name, last_name, email, role, password='', hashed_password=''):
    #     """
    #         Generic function to create user
    #     """
    #     try:
    #         user = self.user_model()
    #         user.first_name = first_name
    #         user.last_name = last_name
    #         user.username = username
    #         user.email = email
    #         user.active = True
    #         user.roles.append(role)
    #         if hashed_password:
    #             user.password = hashed_password
    #         else:
    #             user.password = generate_password_hash(password)
    #         self.get_session.add(user)
    #         self.get_session.commit()
    #         log.info(c.LOGMSG_INF_SEC_ADD_USER.format(username))
    #         return user
    #     except Exception as e:
    #         log.error(c.LOGMSG_ERR_SEC_ADD_USER.format(str(e)))
    #         return False

    def _has_view_access(self, user, permission_name, view_name):
        """
        自定义权限验证方法
        :param user:
        :param permission_name:
        :param view_name:
        :return:
        """
        roles = user.roles
        for role in roles:
            permissions = role.permissions
            if permissions:
                for permission in permissions:
                    if (view_name == permission.view_menu.name) and (permission_name == permission.permission.name):
                        return True
        return False

    def has_access(self, permission_name, view_name):
        """
            Check if current user or public has access to view or menu
        """
        if current_user.is_authenticated():
            return self._has_view_access(g.user, permission_name, view_name)
            # return True
        else:
            return self.is_item_public(permission_name, view_name)
