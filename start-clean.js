#!/usr/bin/env node

/**
 * Start script that cleans up existing processes on ports 5000 and 5173
 * before starting the dev servers
 */

import { exec } from 'child_process';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function killProcessOnPort(port) {
  return new Promise((resolve) => {
    const command = process.platform === 'win32'
      ? `netstat -ano | findstr :${port} | findstr LISTENING | for /f "tokens=5" %a in ('findstr :${port}') do taskkill /PID %a /F 2>nul`
      : `lsof -ti:${port} | xargs kill -9 2>/dev/null`;
    
    exec(command, (error) => {
      // Ignore errors - port might not be in use
      resolve();
    });
  });
}

async function start() {
  console.log('🧹 Cleaning up existing processes...\n');
  
  await killProcessOnPort(5000);
  console.log('✅ Cleared port 5000 (backend)');
  
  await killProcessOnPort(5173);
  console.log('✅ Cleared port 5173 (frontend)');
  
  // Wait a moment for ports to fully clear
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log('\n🚀 Starting development servers...\n');
  
  // Start npm dev (which runs both backend and frontend)
  const dev = spawn('npm', ['run', 'dev'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
  });
  
  dev.on('error', (error) => {
    console.error('Error starting servers:', error);
    process.exit(1);
  });
}

start().catch(console.error);
