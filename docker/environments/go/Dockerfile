FROM golang:1.21-alpine

WORKDIR /app

# Install necessary Go packages
RUN go install github.com/stretchr/testify@latest && \
    go install github.com/golang/mock/mockgen@latest && \
    go install golang.org/x/tools/cmd/goimports@latest

# Set up command to run Go scripts
ENTRYPOINT ["go", "run"]
