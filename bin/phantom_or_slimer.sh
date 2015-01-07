#!/bin/bash -x

. $(dirname $0)/render_params.sh
export DISPLAY=0:0
#if timelimit -t300 -T60 ${COMMAND} --proxy-type=http --proxy=${IP}:3128 --disk-cache=yes --max-disk-cache-size=50000000 /usr/local/lib/render.js "$URL" "${FILE}_tmp.png" "$KEY" "$DELAY" "$LANG" "$WIDTH" "$HEIGHT" "$VP_WIDTH" "$VP_HEIGHT"
if timelimit -t180 -T10 ${COMMAND} --disk-cache=yes --max-disk-cache-size=50000000 /usr/local/lib/render.js "$URL" "${FILE}_tmp.png" "$KEY" "$DELAY" "$LANG" "$WIDTH" "$HEIGHT" "$VP_WIDTH" "$VP_HEIGHT"
then
    if [ -f "${FILE}_tmp.png" ]
    then
        . /usr/local/bin/convert.sh
        chmod 777 "${FILE}.${FILE_TYPE}"
        exit 0
    else
        echo "FAIL: No such file ${FILE}_tmp.png"
        exit 1
    fi
else
    echo "FAIL: $COMMAND could not take image of $URL"
    exit 1
fi
