# Use node as the base image for building both web and server
FROM node:18.17 AS builder

# Set working directory
WORKDIR /app

# Set working directory
WORKDIR /app/web

# Build the web
COPY web/package*.json ./
RUN npm install
COPY web/ ./
RUN npm run build-only

# Build the server
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server/ .

# Use Apache to serve the web and proxy to the server
FROM httpd:2.4

# Install Node.js, curl, and git in the Apache stage
RUN apt-get update && \
    apt-get install -y curl git && \
    curl -sL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy web build output to Apache's htdocs
COPY --from=builder /app/web/dist/ /usr/local/apache2/htdocs/

# Copy the server to a directory inside the container
COPY --from=builder /app/server/ /usr/local/server/

# Set up reverse proxy with .htaccess
COPY ./docker/.htaccess /usr/local/apache2/htdocs/.htaccess

# Copy Apache conf to allow .htaccess
COPY ./docker/my-httpd.conf /usr/local/apache2/conf/httpd.conf

# Copy the entrypoint script
COPY ./docker/entrypoint.sh /usr/local/bin/entrypoint.sh

# Make the entrypoint script executable
RUN chmod +x /usr/local/bin/entrypoint.sh

# Set the entrypoint script as the entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# Expose port 80
EXPOSE 80

# Start Apache
CMD ["httpd-foreground"]