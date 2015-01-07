#!/bin/bash -x

. $(dirname $0)/render_params.sh
export DISPLAY=0:0

if timelimit -t120 -T10 cutycapt "--url=$URL"  --out=${FILE}_tmp.png --user-agent='Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_7; da-dk) AppleWebKit/533.211 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1' --delay=$DELAY --min-width=$WIDTH --min-height=$HEIGHT
then
    if [ -f ${FILE}_tmp.png ]
    then
        . /usr/local/bin/convert.sh
        chmod 777 ${FILE}.${FILE_TYPE}
    else
        echo "No such file ${FILE}_tmp.png"
    fi
else
    echo "Cuty Capt could not take image of $URL"
fi
