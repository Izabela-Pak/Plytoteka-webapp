#!/bin/sh

host="$1"
shift

until nc -z ${host%:*} ${host#*:}; do
  echo "Waiting for database..."
  sleep 2
done

echo "Database is up, starting backend"
exec "$@"