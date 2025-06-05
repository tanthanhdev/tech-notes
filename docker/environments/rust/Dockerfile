FROM rust:1.75-slim

WORKDIR /app

# Install necessary Rust tools
RUN rustup component add rustfmt clippy && \
    cargo install cargo-watch cargo-expand

# Set up command to run Rust scripts
COPY docker/environments/rust/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
