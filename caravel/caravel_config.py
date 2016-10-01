from security import CustomSecurityManager

#---------------------------------------------------------
# Caravel specific config
#---------------------------------------------------------
ROW_LIMIT = 5000
CARAVEL_WORKERS = 16

CARAVEL_WEBSERVER_PORT = 8088
#---------------------------------------------------------

#---------------------------------------------------------
# Flask App Builder configuration
#---------------------------------------------------------
# Your App secret key
SECRET_KEY = '\2\1thisismyscretkey\1\2\e\y\y\h'

# The SQLAlchemy connection string to your database backend
# This connection defines the path to the database that stores your
# caravel metadata (slices, connections, tables, dashboards, ...).
# Note that the connection information to connect to the datasources
# you want to explore are managed directly in the web UI
#SQLALCHEMY_DATABASE_URI = 'sqlite:////tmp/caravel.db'
SQLALCHEMY_DATABASE_URI = 'mysql://caravel:password@localhost/caravel'

# Flask-WTF flag for CSRF
CSRF_ENABLED = True

# Whether to run the web server in debug mode or not
DEBUG = True

# Whether to show the stacktrace on 500 error
SHOW_STACKTRACE = True

# ------------------------------
# GLOBALS FOR APP Builder
# ------------------------------
# Uncomment to setup Your App name
APP_NAME = "Caravel"

# Uncomment to setup Setup an App icon
APP_ICON = "/static/assets/images/caravel_logo.png"

# ---------------------------------------------------
# Babel config for translations
# ---------------------------------------------------
# Setup default language
BABEL_DEFAULT_LOCALE = 'zh'
# Your application default translation path
BABEL_DEFAULT_FOLDER = 'babel/translations'
# The allowed translation for you app
LANGUAGES = {
    'en': {'flag': 'us', 'name': 'English'},
    # 'fr': {'flag': 'fr', 'name': 'French'},
    'zh': {'flag': 'cn', 'name': 'Chinese'},
}

#about cas client config
CAS_LOGIN_ROUTE = '/casWeb/login'
CAS_LOGOUT_ROUTE = '/casWeb/logout'
CAS_VALIDATE_ROUTE = '/casWeb/serviceValidate'
CAS_SERVER = 'http://192.168.0.36:8780/casWeb' 
CAS_AFTER_LOGIN = 'CustomAuthDBView.cas'
CAS_AFTER_LOGOUT_TEMP = 'CustomAuthDBView.cas_logout'

SM_AUTHORIZATION_ROUTE = 'http://192.168.0.36:8880/smWeb/permission/queryUserAuthMenu'
 #?userId=10000&portalCode=caravel_portal

# config to use cas auth
#CUSTOM_SECURITY_MANAGER = CustomSecurityManager
