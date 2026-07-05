const { execSync, spawn } = require('child_process');

function run(cmd) {
  try {
    console.log('> ' + cmd);
    execSync(cmd, { stdio: 'inherit' });
  } catch (err) {
    console.warn('Command failed:', cmd, err && err.message);
  }
}

async function main() {
  // Push schema
  run('npx prisma db push --accept-data-loss');

  // Check user count via Prisma client
  let userCount = 0;
  try {
    const { PrismaClient } = require('@prisma/client');
    const p = new PrismaClient();
    userCount = await p.user.count();
    await p.$disconnect();
  } catch (e) {
    console.warn('Prisma client not available:', e && e.message);
    userCount = 0;
  }

  if (String(userCount) === '0') {
    console.log('Database empty, attempting to run seed (if present)');
    try {
      // compiled seed location
      const seedPath = 'dist/seed/prisma/seed.js';
      run(`node ${seedPath}`);
    } catch (e) {
      console.warn('Seed failed or not found:', e && e.message);
    }
  } else {
    console.log(`Database already has data (${userCount} users)`);
  }

  console.log('Starting CRM server...');
  const child = spawn('node', ['dist/index.js'], { stdio: 'inherit' });
  child.on('exit', (code) => process.exit(code));
}

main();
