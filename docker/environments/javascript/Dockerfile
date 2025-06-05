FROM node:18-slim

WORKDIR /app

# Install necessary Node.js packages
RUN npm install -g \
    jest \
    mocha \
    chai \
    eslint

# Set up command to run JavaScript scripts
ENTRYPOINT ["node"]
