/**
 * Development Startup Script
 * Ensures all services are initialized before starting the dev server
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting REON AI PREP Development Server...\n');

// Start Next.js dev server
const devServer = spawn('npm', ['run', 'dev'], {
  cwd: path.resolve(__dirname, '..'),
  stdio: 'inherit',
  shell: true,
});

devServer.on('error', (error) => {
  console.error('❌ Failed to start dev server:', error);
  process.exit(1);
});

devServer.on('exit', (code) => {
  if (code !== 0) {
    console.error(`\n❌ Dev server exited with code ${code}`);
    process.exit(code);
  }
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down dev server...');
  devServer.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n🛑 Shutting down dev server...');
  devServer.kill('SIGTERM');
  process.exit(0);
});

