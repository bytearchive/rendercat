#!/bin/bash -eux

export NODE_PATH=/app
#Move to supervisord (both of these)
/usr/sbin/nginx &
cd /app
export NODE_PATH=/app
ls /app/modules
node app.js
