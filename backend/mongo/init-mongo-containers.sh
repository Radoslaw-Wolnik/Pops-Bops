#!/bin/bash
set -e

# Use environment variables directly
MONGO_INITDB_ROOT_USERNAME=${MONGO_INITDB_ROOT_USERNAME}
MONGO_INITDB_ROOT_PASSWORD=${MONGO_INITDB_ROOT_PASSWORD}
MONGO_INITDB_DATABASE=${MONGO_INITDB_DATABASE}
MONGO_INITDB_USER=${DB_USER}
MONGO_INITDB_PASSWORD=${DB_PASSWORD}

# Create root user
mongosh admin --eval "
  db.createUser({
    user: '$MONGO_INITDB_ROOT_USERNAME',
    pwd: '$MONGO_INITDB_ROOT_PASSWORD',
    roles: [ { role: 'root', db: 'admin' } ]
  })
"

# Create application user
mongosh $MONGO_INITDB_DATABASE --eval "
  db.createUser({
    user: '$MONGO_INITDB_USER',
    pwd: '$MONGO_INITDB_PASSWORD',
    roles: [ { role: 'readWrite', db: '$MONGO_INITDB_DATABASE' } ]
  })
"

echo "MongoDB users created."