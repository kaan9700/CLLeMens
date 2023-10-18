# Dockerfile to create a SQLite3 database from a dump
FROM alpine:latest
LABEL author="Jimmy Neitzert"
# Install sqlite
RUN apk add --no-cache sqlite

# Set work directory
WORKDIR /db

# Run sqlite3 command to create a new database from the dump file
CMD sqlite3 db.sqlite3 < dump.sql
