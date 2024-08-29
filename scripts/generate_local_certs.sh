#!/bin/bash
# generate_local_certs.sh

DOMAIN="localhost"
CERT_DIR="./certs"

# Get the directory of the script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Navigate to the root directory (one level up from scripts)
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Create cert directory if it doesn't exist
mkdir -p "$ROOT_DIR/$CERT_DIR"

# Count files to be deleted
file_count=$(find "$ROOT_DIR/$CERT_DIR" -type f ! -name '.gitkeep' | wc -l)

echo "This will delete $file_count file(s) (except .gitkeep) in $ROOT_DIR/$CERT_DIR"
echo "Files to be deleted:"
find "$ROOT_DIR/$CERT_DIR" -type f ! -name '.gitkeep' -print0 | while IFS= read -r -d '' file; do
    echo "  - $(basename "$file")"
done

read -p "Are you sure you want to continue? (y/n) " -n 1 -r
echo    # move to a new line
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "Operation cancelled."
    exit 1
fi

echo "Cleaning up old certificates..."
find "$ROOT_DIR/$CERT_DIR" -type f ! -name '.gitkeep' -delete

#Generate root CA
openssl req -x509 -nodes -new -sha256 -days 1024 -newkey rsa:2048 \
    -keyout "$ROOT_DIR/$CERT_DIR/RootCA.key" \
    -out "$ROOT_DIR/$CERT_DIR/RootCA.pem" \
    -subj "/C=US/CN=Example-Root-CA"

# Generate domain certificate
openssl req -new -nodes -newkey rsa:2048 \
    -keyout "$ROOT_DIR/$CERT_DIR/localhost.key" \
    -out "$ROOT_DIR/$CERT_DIR/localhost.csr" \
    -subj "/C=US/ST=YourState/L=YourCity/O=Example-Certificates/CN=$DOMAIN"

# Sign the certificate
openssl x509 -req -sha256 -days 1024 \
    -in "$ROOT_DIR/$CERT_DIR/localhost.csr" \
    -CA "$ROOT_DIR/$CERT_DIR/RootCA.pem" \
    -CAkey "$ROOT_DIR/$CERT_DIR/RootCA.key" \
    -CAcreateserial \
    -extfile <(printf "subjectAltName=DNS:$DOMAIN,DNS:www.$DOMAIN") \
    -out "$ROOT_DIR/$CERT_DIR/localhost.crt"

echo "Certificates generated in $ROOT_DIR/$CERT_DIR"
echo "Don't forget to add the RootCA.pem to your browser's trusted certificates for local HTTPS to work correctly."
