#!/bin/sh
#ip="$(/sbin/ifconfig eth0 | sed -En 's/127.0.0.1//;s/.*inet (addr:)?(([0-9]*\.){3}[0-9]*).*/\2/p')"
#url="http://${ip}/"
#(curl --max-time 3 -s ${url} | grep status) || ( echo "FAIL: Could not reach ${url}" && exit 1)
