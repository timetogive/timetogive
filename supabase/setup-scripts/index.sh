source ./envs.sh
psql $POSTGRES_CONNECTION_STRING -f ./index.sql