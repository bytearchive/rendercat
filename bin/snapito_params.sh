#!/bin/bash
export COMMAND="$1"
shift 
export URL="$(python -c "import urllib, sys; print urllib.unquote(sys.argv[1])" $1)"
export FILE="/img/$2"
export KEY="$3"
export DELAY="$4"
export LANG="$5"
export WIDTH="$6"
export HEIGHT="$7"
export VP_WIDTH="$8"
export VP_HEIGHT="$9"
export FILE_TYPE="${10}"
export FILTER="${11}"
export UNSHARP="${12}"
export CROPX="${13}"
export CROPY="${14}"
export CROPW="${15}"
export CROPH="${16}"
if (( $DELAY > 0 ))
then
    DELAY="$DELAY"
else
    DELAY=0
fi

