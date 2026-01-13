#!/bin/bash

# Generate Production Secrets
# Usage: ./scripts/generate-secrets.sh

echo "🔐 Generating Production Secrets"
echo ""
echo "JWT_SECRET:"
openssl rand -base64 32
echo ""
echo "Database Password (use this for PostgreSQL):"
openssl rand -base64 24
echo ""
echo "✅ Save these secrets securely!"
echo "   Add them to your deployment platform's environment variables"
