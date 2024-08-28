#!/bin/bash

# Create secrets directory if it doesn't exist
mkdir -p secrets

# Generate secrets
echo "root" > secrets/db_root_username
openssl rand -base64 32 | tr -d /=+ | cut -c -16 > secrets/db_root_password
echo "mydatabase" > secrets/db_name
echo "myuser" > secrets/db_user
openssl rand -base64 32 | tr -d /=+ | cut -c -16 > secrets/db_password
openssl rand -base64 32 | tr -d /=+ | cut -c -32 > secrets/jwt_secret

# Set default values for email secrets
echo "smtp.example.com" > secrets/email_host
echo "587" > secrets/email_port
echo "user@example.com" > secrets/email_user
echo "defaultpassword" > secrets/email_password
echo "noreply@example.com" > secrets/email_from

# Override with local secrets if available
if [ -f "./local_secrets.sh" ]; then
    echo "Applying local secrets..."
    source ./local_secrets.sh
fi

echo "Secrets generated successfully."