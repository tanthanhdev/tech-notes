FROM gcc:12

WORKDIR /app

# Install necessary development tools
RUN apt-get update && apt-get install -y \
    cmake \
    make \
    gdb \
    valgrind \
    && rm -rf /var/lib/apt/lists/*

# Set up compilation and execution command
COPY docker/environments/cpp/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
