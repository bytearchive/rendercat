#!/bin/bash -x
curWidth=$(gm identify -format "%w" "${FILE}_tmp.png")
curHeight=$(gm identify -format "%h" "${FILE}_tmp.png")
command="timelimit -t10 -T5 gm convert "
(( $WIDTH == -1 )) && WIDTH=$curWidth
(( $HEIGHT == -1 )) && HEIGHT=$curHeight
command="$command -resize ${WIDTH}x${HEIGHT}^"
command="$command ${FILE}_tmp.png ${FILE}_tmp2.png"
$command
command="timelimit -t10 -T5 gm convert "
if (($CROPW > -1 )) || (($CROPH > -1))
then
	(( $CROPX+$CROPW > $curWidth )) && CROPW=$(($curWidth - $CROPX))
	command="$command -crop ${CROPW}x${CROPH}+${CROPX}+${CROPY} "
else
    command="$command -crop ${WIDTH}x${HEIGHT}+0+0 "
fi
(( $UNSHARP > 0 ))  && command="$command -unsharp $UNSHARP"
command="$command -filter $FILTER"
command="$command ${FILE}_tmp2.png ${FILE}.${FILE_TYPE}"
$command
rm "${FILE}_tmp2.png" "${FILE}_tmp.png"
