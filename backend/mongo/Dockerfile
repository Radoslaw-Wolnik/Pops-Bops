FROM mongo:6.0 

COPY mongod.conf /etc/mongod.conf
COPY init-mongo.sh /docker-entrypoint-initdb.d/init-mongo.sh

RUN chmod +x /docker-entrypoint-initdb.d/init-mongo.sh

CMD ["mongod", "--config", "/etc/mongod.conf"]
# command: ["mongod", "--config", "/etc/mongod.conf", "--verbose"]

#  - ./backend/scripts/init-mongo.js:/docker-entrypoint-initdb.d/init-mongo.js
#  - ./mongod.conf:/etc/mongod.conf
# now either initialize mongo here or in the start-project.sh