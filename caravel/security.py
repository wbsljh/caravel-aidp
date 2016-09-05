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
from flask_login import login_user, logout_user

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
            user = User()
            user.id = attributes['cas:userId']
            user.username = username
            user.first_name = username
            user.last_name = username
            return user
        else:
            return None
