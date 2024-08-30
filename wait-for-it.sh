#!/bin/sh
# wait-for-it.sh
host="$1"
shift
cmd="$@"

until nc -z "$host" 3306; do
  >&2 echo "Banco de dados ainda não está disponível - aguardando..."
  sleep 2
done

>&2 echo "Banco de dados está disponível - iniciando o back-end..."
exec $cmd



