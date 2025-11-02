#!/bin/sh
# Database initialization and health check script
# This ensures the database is fully ready before the backend starts

set -e

echo "Waiting for MySQL to be ready..."

# Wait for MySQL to accept connections
until mysql -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -e "SELECT 1" > /dev/null 2>&1; do
  echo "MySQL is unavailable - sleeping"
  sleep 2
done

echo "MySQL is up - checking tables..."

# Check if tables exist
TABLE_COUNT=$(mysql -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -sN -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='$DB_NAME'")

if [ "$TABLE_COUNT" -eq "0" ]; then
  echo "No tables found. Schema should be initialized by MySQL init scripts."
  sleep 5
else
  echo "Found $TABLE_COUNT tables in database"
fi

echo "Database is ready!"
