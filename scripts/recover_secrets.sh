#!/bin/bash

# Get the directory of the script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Navigate to the root directory (one level up from scripts)
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Secrets directory
SECRETS_DIR="$ROOT_DIR/secrets"

# Backup directory
BACKUP_DIR="$ROOT_DIR/secrets_backups"

# Function to restore secrets
restore_secrets() {
    local backup_file="$1"
    if [ ! -f "$backup_file" ]; then
        echo "Backup file not found: $backup_file"
        exit 1
    fi
    # Decrypt and extract the backup
    openssl enc -d -aes-256-cbc -in "$backup_file" | tar xz -C "$ROOT_DIR"
    echo "Secrets restored from $backup_file"
}

# Function to list backups
list_backups() {
    echo "Available backups:"
    ls -1 "$BACKUP_DIR"/*.enc 2>/dev/null || echo "No backups found."
}

# Main script logic
case "$1" in
    restore)
        if [ -z "$2" ]; then
            echo "Usage: $0 restore <backup_file>"
            exit 1
        fi
        restore_secrets "$2"
        ;;
    list)
        list_backups
        ;;
    *)
        echo "Usage: $0 {restore <backup_file>|list}"
        exit 1
        ;;
esac