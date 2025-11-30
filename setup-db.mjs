#!/usr/bin/env node
/**
 * Database Setup Helper
 * Interactive script to help configure Neon PostgreSQL
 */

import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise(resolve => rl.question(prompt, resolve));
}

async function main() {
  console.log('\n🎄 Christmas Game - Database Setup Helper\n');
  console.log('This script will help you configure Neon PostgreSQL.\n');

  const hasAccount = await question('Do you have a Neon account? (yes/no): ');

  if (hasAccount.toLowerCase() !== 'yes') {
    console.log('\n📝 Steps to create a Neon account:');
    console.log('1. Go to https://console.neon.tech');
    console.log('2. Click "Sign Up" and create an account');
    console.log('3. Create a new project called "christmas-game"');
    console.log('4. Copy the connection string from the dashboard\n');
    console.log('Then run this script again!\n');
    rl.close();
    return;
  }

  console.log('\n🔗 Please paste your Neon connection string:');
  console.log('(Find it in Neon dashboard > Your Database > Connection String)\n');

  const connectionString = await question('Connection string: ');

  if (!connectionString.startsWith('postgresql://')) {
    console.log('\n❌ Invalid connection string. Must start with "postgresql://"\n');
    rl.close();
    return;
  }

  // Write to backend/.env
  const envPath = path.join(__dirname, 'backend', '.env');
  const envContent = `DATABASE_URL=${connectionString}
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
`;

  fs.writeFileSync(envPath, envContent);
  console.log(`\n✅ Configuration saved to backend/.env\n`);

  const runMigrate = await question('Run database migrations now? (yes/no): ');

  if (runMigrate.toLowerCase() === 'yes') {
    console.log('\n🔄 Running migrations...\n');
    const { exec } = await import('child_process');
    exec('cd backend && npm run migrate', (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Migration failed:', stderr);
      } else {
        console.log(stdout);
        console.log('✅ Migrations completed!\n');
        
        const runSeed = question('Seed sample puzzles? (yes/no): ');
        runSeed.then(answer => {
          if (answer.toLowerCase() === 'yes') {
            console.log('🌱 Seeding puzzles...\n');
            exec('cd backend && npm run seed', (error, stdout, stderr) => {
              if (error) {
                console.error('❌ Seeding failed:', stderr);
              } else {
                console.log(stdout);
                console.log('✅ Setup complete! Run: npm run dev\n');
              }
              rl.close();
            });
          } else {
            console.log('\n✅ Ready to start! Run: npm run dev\n');
            rl.close();
          }
        });
      }
    });
  } else {
    console.log('\n✅ Configuration saved!');
    console.log('Run these commands manually:\n');
    console.log('  cd backend');
    console.log('  npm run migrate');
    console.log('  npm run seed (optional)\n');
    rl.close();
  }
}

main().catch(console.error);
