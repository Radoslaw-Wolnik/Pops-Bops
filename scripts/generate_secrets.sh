#!/bin/bash

# Get the directory of the script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Navigate to the root directory (one level up from scripts)
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Create secrets directory if it doesn't exist
mkdir -p "$ROOT_DIR/secrets"

# Generate secrets
echo "root" > "$ROOT_DIR/secrets/db_root_username"
openssl rand -base64 32 | tr -d /=+ | cut -c -16 > "$ROOT_DIR/secrets/db_root_password"
echo "mydatabase" > "$ROOT_DIR/secrets/db_name"
echo "myuser" > "$ROOT_DIR/secrets/db_user"
openssl rand -base64 32 | tr -d /=+ | cut -c -16 > "$ROOT_DIR/secrets/db_password"
openssl rand -base64 32 | tr -d /=+ | cut -c -32 > "$ROOT_DIR/secrets/jwt_secret"

# Generate a 256-bit (32 byte) encryption key
openssl rand -base64 32 > "$ROOT_DIR/secrets/encryption_key"

# Set default values for email secrets
echo "smtp.example.com" > "$ROOT_DIR/secrets/email_host"
echo "587" > "$ROOT_DIR/secrets/email_port"
echo "user@example.com" > "$ROOT_DIR/secrets/email_user"
echo "defaultpassword" > "$ROOT_DIR/secrets/email_password"
echo "noreply@example.com" > "$ROOT_DIR/secrets/email_from"

# Generate domain name and rate limit secrets
echo "localhost" > "$ROOT_DIR/secrets/domain_name"
echo "100" > "$ROOT_DIR/secrets/rate_limit_average"
echo "50" > "$ROOT_DIR/secrets/rate_limit_burst"

# Generate Traefik authentication secret
echo "admin:$(htpasswd -nb -B admin password | cut -d ":" -f 2)" > "$ROOT_DIR/secrets/traefik_auth"


# Override with local secrets if available
if [ -f "$SCRIPT_DIR/local_secrets.sh" ]; then
    echo "Applying local secrets..."
    source "$SCRIPT_DIR/local_secrets.sh"
fi

echo "Secrets generated successfully in $ROOT_DIR/secrets"