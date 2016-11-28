#!/usr/bin/env bash
uwsgi --stop /tmp/uwsgi_caravel.pid 
uwsgi -d /var/log/uwsgi.log --ini /home/dv/caravel-aidp/uwsgi.ini &
