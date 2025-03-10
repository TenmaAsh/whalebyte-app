#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Create .env.local file with simulator settings
const envContent = `NEXT_PUBLIC_SIMULATOR_MODE=true
NEXT_PUBLIC_SKIP_VALIDATION=true
`;

fs.writeFileSync(path.join(process.cwd(), '.env.local'), envContent);
console.log('Created .env.local with simulator settings');

// Set environment variables to disable linting and type checking
process.env.NEXT_DISABLE_ESLINT = '1';
process.env.NEXT_DISABLE_TYPECHECK = '1';

console.log('Starting the simulator environment...');
console.log('Access the application at http://localhost:3000');
console.log('Press Ctrl+C to stop the server');

// Start the development server
const nextDev = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  env: { ...process.env }
});

// Handle process exit
process.on('SIGINT', () => {
  console.log('\nShutting down simulator...');
  nextDev.kill('SIGINT');
  process.exit(0);
});

nextDev.on('close', (code) => {
  console.log(`Development server exited with code ${code}`);
  process.exit(code);
});