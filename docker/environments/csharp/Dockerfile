FROM mcr.microsoft.com/dotnet/sdk:7.0

WORKDIR /app

# Install necessary .NET tools
RUN dotnet tool install -g dotnet-format && \
    dotnet tool install -g dotnet-trace && \
    dotnet tool install -g dotnet-counters

# Add .NET tools to PATH
ENV PATH="$PATH:/root/.dotnet/tools"

# Set up compilation and execution command
COPY docker/environments/csharp/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
