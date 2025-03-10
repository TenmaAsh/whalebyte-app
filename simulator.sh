#!/bin/bash

# Clean up previous builds
rm -rf .next out

# Install dependencies
npm install

# Create a temporary .env.local file for simulator
echo "NEXT_PUBLIC_SIMULATOR_MODE=true" > .env.local
echo "NEXT_PUBLIC_SKIP_VALIDATION=true" >> .env.local

# Start the development server with linter checks disabled
echo "Starting the simulator environment..."
echo "Access the application at http://localhost:3000"
echo "Press Ctrl+C to stop the server"
NEXT_DISABLE_ESLINT=1 NEXT_DISABLE_TYPECHECK=1 npm run dev