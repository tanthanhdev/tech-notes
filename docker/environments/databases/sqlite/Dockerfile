FROM alpine:3.17

# Install SQLite and required tools
RUN apk add --no-cache sqlite sqlite-dev sqlite-libs bash

# Create data directory
RUN mkdir -p /data

# Set working directory
WORKDIR /data

# Copy init script
COPY init.sh /init.sh
COPY init.sql /init.sql

# Make the script executable
RUN chmod +x /init.sh

# Run init script on startup
ENTRYPOINT ["/init.sh"]
