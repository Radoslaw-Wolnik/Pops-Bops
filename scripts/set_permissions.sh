#!/bin/bash

# Array of scripts that need executable permissions
scripts=(
    "generate_secrets.sh"
    "start_project.sh"
    "local_secrets.sh"
    "backup_secrets.sh"
    "set_permissions.sh"
)

# Function to set executable permissions
set_executable() {
    if [ -f "$1" ]; then
        chmod +x "$1"
        echo "Set executable permissions for $1"
    else
        echo "Warning: $1 not found"
    fi
}


# Function to set executable permissions
set_executable() {
    if [ -f "$1" ]; then
        chmod +x "$1"
        echo "Set executable permissions for $1"
    else
        echo "Warning: $1 not found"
    fi
}

# Main execution
echo "Setting executable permissions for project scripts..."

# Change to the scripts directory
cd "$(dirname "$0")" || exit

for script in "${scripts[@]}"; do
    set_executable "$script"
done

echo "Permissions update completed."