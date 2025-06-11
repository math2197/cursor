#!/bin/sh
#   Use this script to test if a given TCP host/port are available
#
#   Usage:
#     ./wait-for-it.sh host:port [-s] [-t timeout] [-- command args]
#     -h HOST | --host=HOST       Host or IP under test
#     -p PORT | --port=PORT       TCP port under test
#                                 Alternatively, you specify the host and port as host:port
#     -s | --strict               Only execute subcommand if the test succeeds
#     -q | --quiet                Don\'t output any status messages
#     -t TIMEOUT | --timeout=TIMEOUT
#                                 Timeout in seconds, zero for no timeout
#     -- COMMAND ARGS             Execute command with args after the test finishes
#
#   See more: https://github.com/vishnubob/wait-for-it

set -e

TIMEOUT=15
QUIET=0
STRICT=0
HOST=""
PORT=""

while [ $# -gt 0 ]; do
    case "$1" in
        *:* )
        HOST=$(echo $1 | cut -d: -f1)
        PORT=$(echo $1 | cut -d: -f2)
        shift 1
        ;;
        -h)
        HOST="$2"
        shift 2
        ;;
        --host=*)
        HOST="${1#*=}"
        shift 1
        ;;
        -p)
        PORT="$2"
        shift 2
        ;;
        --port=*)
        PORT="${1#*=}"
        shift 1
        ;;
        -t)
        TIMEOUT="$2"
        shift 2
        ;;
        --timeout=*)
        TIMEOUT="${1#*=}"
        shift 1
        ;;
        -q|--quiet)
        QUIET=1
        shift 1
        ;;
        -s|--strict)
        STRICT=1
        shift 1
        ;;
        --)
        shift
        break
        ;;
        *)
        echo "Unknown argument: $1"
        exit 1
        ;;
    esac
    done

if [ "$HOST" = "" ] || [ "$PORT" = "" ]; then
    echo "Error: you need to provide a host and port to test."
    exit 1
fi

for i in $(seq $TIMEOUT); do
    nc -z "$HOST" "$PORT" >/dev/null 2>&1 && break
    if [ $QUIET -ne 1 ]; then
        echo "Waiting for $HOST:$PORT... ($i/$TIMEOUT)"
    fi
    sleep 1
    done

if [ $i -eq $TIMEOUT ]; then
    echo "Timeout occurred after waiting $TIMEOUT seconds for $HOST:$PORT"
    exit 1
fi

if [ $QUIET -ne 1 ]; then
    echo "$HOST:$PORT is available!"
fi

if [ $STRICT -eq 1 ]; then
    if [ $i -eq $TIMEOUT ]; then
        exit 1
    fi
fi

exec "$@" 