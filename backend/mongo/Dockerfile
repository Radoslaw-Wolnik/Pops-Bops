FROM mongo:latest

ADD mongo.conf /etc/mongo.conf

CMD ["mongod", "--config", "etc/mongo.conf"]
# command: ["mongod", "--config", "/etc/mongod.conf", "--verbose"]

#  - ./backend/scripts/init-mongo.js:/docker-entrypoint-initdb.d/init-mongo.js
#  - ./mongod.conf:/etc/mongod.conf
# now either initialize mongo here or in the start-project.sh