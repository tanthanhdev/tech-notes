FROM ubuntu:22.04

# Install essential tools and utilities
RUN apt-get update && apt-get install -y \
    bash \
    bc \
    curl \
    git \
    iputils-ping \
    iproute2 \
    net-tools \
    nodejs \
    npm \
    openssh-client \
    procps \
    systemd \
    vim \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Set up working directory
WORKDIR /app

# Set bash as the default shell
SHELL ["/bin/bash", "-c"]

# Set entrypoint to bash shell
ENTRYPOINT ["/bin/bash"]
