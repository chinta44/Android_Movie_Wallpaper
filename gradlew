#!/bin/sh
APP_BASE_NAME=`basename "$0"`
DIRNAME=`dirname "$0"`
exec "$DIRNAME/gradle/wrapper/gradle-wrapper.jar" "$@" 2>/dev/null || gradle "$@"
