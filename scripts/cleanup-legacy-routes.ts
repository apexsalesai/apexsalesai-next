/**
 * Legacy Route Cleanup Script
 * Removes old API routes that cause 500/503 errors
 */

import fs from 'fs';
import path from 'path';

const routesToRemove = [
  'app/api/posts',
  'app/api/kpis',
  'app/api/jobs',
];

function removeDirectory(dirPath: string): boolean {
  const fullPath = path.resolve(dirPath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`  ℹ️  ${dirPath} - already removed`);
    return true;
  }

  try {
    fs.rmSync(fullPath, { recursive: true, force: true });
    console.log(`  ✅ ${dirPath} - removed`);
    return true;
  } catch (error: any) {
    console.log(`  ❌ ${dirPath} - failed to remove: ${error.message}`);
    return false;
  }
}

function main() {
  console.log('\n🧹 Cleaning up legacy API routes...\n');

  let allRemoved = true;

  for (const route of routesToRemove) {
    const success = removeDirectory(route);
    if (!success) allRemoved = false;
  }

  if (allRemoved) {
    console.log('\n✅ All legacy routes cleaned up successfully!\n');
  } else {
    console.log('\n⚠️  Some routes could not be removed. Check permissions.\n');
    process.exit(1);
  }
}

main();
