#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Stopping containers..."
docker-compose -f docker-compose-containers.yml down

echo "Removing unused Docker resources..."
docker system prune -f

echo "Containers stopped and unused resources removed."