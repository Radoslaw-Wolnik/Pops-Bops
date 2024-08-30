#!/bin/bash

echo "Checking password store directory content:"
ls -R ~/.password-store/

echo "Removing password store directory:"
rm -rf ~/.password-store

echo "Reinitializing password store:"
gpg_key_id=$(gpg --list-secret-keys --keyid-format LONG | grep sec | head -n 1 | awk '{print $2}' | cut -d'/' -f2)
pass init $gpg_key_id

echo "Verifying empty password store:"
pass ls

echo "Password store has been reinitialized."