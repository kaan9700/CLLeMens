# Dockerfile to dump a SQLite3 database
FROM alpine:latest
# Install sqlite
RUN apk add --no-cache sqlite

# Set work directory
WORKDIR /db
#COPY db.sqlite3 db.sqlite3
# Run sqlite3 command to dump the database
RUN echo "List files in /db directory:"
RUN ls -la /db

CMD ["sh", "-c", "sqlite3 db.sqlite3 .dump > dump.sql"]
