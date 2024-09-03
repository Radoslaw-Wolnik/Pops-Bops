#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Build images
echo "Building frontend image..."
docker build -t frontend-image:latest ./frontend

echo "Building backend image..."
docker build -t backend-image:latest ./backend

echo "Building mongo image..."
docker build -t mongo-image:latest ./backend/mongo

# Start the containers
echo "Starting containers..."
docker-compose -f docker-compose-containers.yml up -d

echo "Containers started successfully."