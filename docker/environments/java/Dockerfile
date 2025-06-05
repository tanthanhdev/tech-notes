FROM openjdk:17-slim

WORKDIR /app

# Install build tools
RUN apt-get update && apt-get install -y \
    maven \
    gradle \
    && rm -rf /var/lib/apt/lists/*

# Set up compilation and execution command
COPY docker/environments/java/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
