#!/bin/bash
set -e

echo "=== Recurb Installation Script ==="

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "Error: Node.js 18+ required. Current version: $(node -v)"
    exit 1
fi

echo "✓ Node.js $(node -v) detected"

# Install dependencies
echo "Installing dependencies..."
npm install

# Create data directory
mkdir -p data

# Copy environment file
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✓ Created .env file"
fi

# Run migrations
echo "Running database migrations..."
npm run migrate

# Build application
echo "Building application..."
npm run build

echo ""
echo "=== Installation Complete ==="
echo "Start the server with: npm start"
echo "Visit http://localhost:3000/setup to complete setup"
