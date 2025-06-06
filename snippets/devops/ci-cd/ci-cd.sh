#!/bin/bash
#
# Simple CI/CD Pipeline Script
# This script demonstrates a basic CI/CD pipeline for a Node.js application
#

# Exit immediately if a command exits with a non-zero status
set -e

# Print commands and their arguments as they are executed
set -x

# Define variables
APP_NAME="my-nodejs-app"
REPO_URL="https://github.com/username/my-nodejs-app.git"
DEPLOY_DIR="/var/www/my-nodejs-app"
LOG_FILE="pipeline.log"

# Function to log messages
log_message() {
  local timestamp=$(date +"%Y-%m-%d %H:%M:%S")
  echo "[$timestamp] $1" | tee -a $LOG_FILE
}

# Function to handle errors
handle_error() {
  log_message "ERROR: An error occurred on line $1"
  exit 1
}

# Set up error handling
trap 'handle_error $LINENO' ERR

# Start the pipeline
log_message "Starting CI/CD pipeline for $APP_NAME"

# Step 1: Clean workspace
log_message "Step 1: Cleaning workspace"
rm -rf build
mkdir -p build
cd build

# Step 2: Clone the repository
log_message "Step 2: Cloning repository"
git clone $REPO_URL .
git checkout main

# Step 3: Install dependencies
log_message "Step 3: Installing dependencies"
npm ci

# Step 4: Run linting
log_message "Step 4: Running linting"
npm run lint

# Step 5: Run tests
log_message "Step 5: Running tests"
npm test

# Step 6: Build the application
log_message "Step 6: Building the application"
npm run build

# Step 7: Run security audit
log_message "Step 7: Running security audit"
npm audit --production

# Step 8: Deploy to production
log_message "Step 8: Deploying to production"
# Check if deploy directory exists
if [ ! -d "$DEPLOY_DIR" ]; then
  mkdir -p $DEPLOY_DIR
fi

# Copy build files to deploy directory
cp -r dist/* $DEPLOY_DIR

# Step 9: Restart the application
log_message "Step 9: Restarting the application"
# This is a simplified example - in reality, you might use systemd, PM2, etc.
cd $DEPLOY_DIR
npm run stop || true  # Don't fail if the app isn't running
npm run start

# Step 10: Run smoke tests
log_message "Step 10: Running smoke tests"
# Simple curl test to verify the application is responding
sleep 5  # Wait for the app to start
if curl -s http://localhost:3000/health | grep -q "ok"; then
  log_message "Smoke test passed!"
else
  log_message "Smoke test failed!"
  exit 1
fi

# Pipeline completed successfully
log_message "CI/CD pipeline completed successfully!"
