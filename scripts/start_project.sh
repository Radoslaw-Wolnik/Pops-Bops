#!/bin/bash

# Function to check if local secrets need updating
check_local_secrets() {
    local secrets_file="./local_secrets.sh"
    local max_age=$((30 * 24 * 60 * 60))  # 30 days in seconds

    if [ -f "$secrets_file" ]; then
        local file_age=$(($(date +%s) - $(date -r "$secrets_file" +%s)))
        if [ $file_age -gt $max_age ]; then
            echo "Warning: Your local secrets file is older than 30 days."
            echo "Consider updating it by running: ./local_secrets.sh"
            read -p "Do you want to continue anyway? (y/n) " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                exit 1
            fi
        fi
    else
        echo "Warning: local_secrets.sh not found. Some features may not work correctly."
        read -p "Do you want to continue anyway? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
}

# Check local secrets
source "$(dirname "$0")/check_local_secrets.sh"

# Generate secrets
"$(dirname "$0")/generate_secrets.sh"

# Start the project (assuming docker-compose.yml is in the parent directory)
docker-compose -f "$(dirname "$0")/../docker-compose.yml" up -d


# Get the assigned ports
BACKEND_PORT=$(docker-compose port backend 5443 | cut -d: -f2)
FRONTEND_PORT=$(docker-compose port frontend 5173 | cut -d: -f2)

echo "Backend running on port $BACKEND_PORT"
echo "Frontend running on port $FRONTEND_PORT"