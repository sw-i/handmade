FROM mysql:8.0

# Pre-configure MySQL
ENV MYSQL_ROOT_PASSWORD=rootpassword123
ENV MYSQL_DATABASE=handmade_hub
ENV MYSQL_USER=handmade_user
ENV MYSQL_PASSWORD=handmade_password123

# Copy schema
COPY schema.sql /docker-entrypoint-initdb.d/

# Expose port
EXPOSE 3306
