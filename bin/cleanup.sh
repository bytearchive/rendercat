#!/bin/sh
while true
do
    echo Cleaning ...
    find /app/public/_rendered/ -name "*.*" -mmin +180 -exec rm {} \;
    find /var/log -name "snapshot*.log" -mmin +180 -exec rm {} \;
    find /var/log -name "*.log" -mtime +2 -exec rm {} \;
    sleep 3600
done
