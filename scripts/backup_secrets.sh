#!/bin/bash

# Get the directory of the script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Navigate to the root directory (one level up from scripts)
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Set the backup directory
BACKUP_DIR="$ROOT_DIR/secret_backups"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Create a timestamp for the backup file
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Create an encrypted tar archive of the secrets directory
tar -czf - "$ROOT_DIR/secrets" | openssl enc -aes-256-cbc -salt -out "$BACKUP_DIR/secrets_backup_$TIMESTAMP.tar.gz.enc"

echo "Secrets backed up and encrypted to $BACKUP_DIR/secrets_backup_$TIMESTAMP.tar.gz.enc"
echo "Please store this file securely and separately from your database backups."