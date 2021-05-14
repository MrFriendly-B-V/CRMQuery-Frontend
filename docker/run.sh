#!/bin/bash

if [ -z "${HOST}" ]
then
    echo "Environmental variable 'HOST' is not set. This is required."
    exit 1
fi

sed -i "s|{{HOST}}|${HOST}|" /var/www/html/config.json
/usr/sbin/nginx -g 'daemon off;'