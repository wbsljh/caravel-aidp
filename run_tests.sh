#!/usr/bin/env bash
export CARAVEL_CONFIG=config.caravel_config
uwsgi --stop /tmp/uwsgi_caravel.pid
uwsgi -d /var/log/uwsgi.log --ini uwsgi.ini &
