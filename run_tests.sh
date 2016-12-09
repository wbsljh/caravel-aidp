#!/usr/bin/env bash
export PYTHONPATH=$(cd `dirname $0`; pwd)/caravel
uwsgi --stop /tmp/uwsgi_caravel.pid
uwsgi -d /var/log/uwsgi.log --ini uwsgi.ini &
