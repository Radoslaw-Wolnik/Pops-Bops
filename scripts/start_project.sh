#!/bin/bash

# Define your stack name
STACK_NAME="pops-and-bops"

# Get the directory of the script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Parse command line arguments
if [ "$1" == "--dev" ]; then
    ENV="development"
elif [ "$1" == "--prod" ]; then
    ENV="production"
else
    echo "Usage: $0 [--dev|--prod]"
    exit 1
fi

# Function to manage secrets
manage_secrets() {
    if [ "$ENV" == "development" ]; then
        ./manage_secrets.sh --no-cron
    else
        ./manage_secrets.sh
    fi
    ./local_secrets.sh
}

# Function to handle certificates
handle_certificates() {
    if [ "$ENV" == "development" ]; then
        ./generate_dev_certs_extended.sh # can be changed ot ./generate_dev_certs_simple.sh
    else
        # Ensure Let's Encrypt setup is in place
        # This might involve checking for existing certs and renewing if necessary
        echo "Ensuring Let's Encrypt certificates are in place..."
        # Add your Let's Encrypt certificate check/renewal logic here
    fi
}


# Initialize Docker Swarm 
init_swarm() {
    if ! docker info | grep -q 'Swarm: active'; then
        echo "Initializing Docker Swarm mode..."
        docker swarm init
    else
        echo "Docker Swarm is already active."
    fi
}

# Function to create Docker secrets
create_docker_secrets() {
    echo "Creating Docker secrets..."
    pass ls | while read secret_name; do
        echo "Creating Docker secret: $secret_name"
        docker secret rm "$secret_name" 2>/dev/null
        pass show "$secret_name" | docker secret create "$secret_name" -
    done
}

# Main execution starts here

echo "Starting project in $ENV mode..."

# Manage secrets
manage_secrets

# Handle certificates
handle_certificates

# Initialize Docker Swarm
init_swarm

# Create Docker secrets
create_docker_secrets

# Build Docker images
echo "Building Docker images..."
docker build -t backend-image:latest --target $ENV "$SCRIPT_DIR/../backend"
docker build -t frontend-image:latest --target $ENV "$SCRIPT_DIR/../frontend"


# Deploy the stack
echo "Deploying the stack..."
export NODE_ENV=$ENV
docker stack deploy -c "$SCRIPT_DIR/../docker-compose.yml" $STACK_NAME

echo "Waiting for services to start..."
sleep 30

echo "Deployed services:"
docker stack services $STACK_NAME

DOMAIN_NAME=$(pass show domain_name)
echo "Access your services at:"
echo "Frontend: https://${DOMAIN_NAME}"
echo "Backend API: https://${DOMAIN_NAME}/api"

echo "Service status:"
docker service ls --filter name=${STACK_NAME}

# If you need to troubleshoot, you can get more detailed information about a specific service
# echo "Detailed information for backend service:"
# docker service ps ${STACK_NAME}_backend
