#!/bin/bash -x
service xvfb start
sleep 20
for i in http://example.com http://google.com http://bbc.com
do
    rm /img/test.png
    time echo "render slimer $i test test 0 en-gb 1024 768 1024 768 png Box -1 -1 -1 -1  0  &> /dev/null" | bash
done
service xvfb stop