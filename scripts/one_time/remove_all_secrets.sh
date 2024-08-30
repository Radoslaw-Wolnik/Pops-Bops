#!/bin/bash

# List all secrets
secrets=$(pass ls)

# Remove each secret
while IFS= read -r secret; do
    if [[ -n "$secret" ]]; then
        echo "Removing secret: $secret"
        pass rm -f "$secret"
    fi
done <<< "$secrets"

echo "All secrets have been removed."