#!/usr/bin/env node

/**
 * Release Tagging Script for ApexSalesAI
 * 
 * Usage:
 *   node scripts/tag-release.js v0.3.0 "Implemented Dataverse OAuth integration"
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get the version and message from command line args
const version = process.argv[2];
const message = process.argv.slice(3).join(' ');

// Validate inputs
if (!version || !message) {
  console.error('Error: Version and message are required');
  console.log('Usage: node scripts/tag-release.js v0.3.0 "Your release message"');
  process.exit(1);
}

// Validate version format
if (!/^v\d+\.\d+\.\d+$/.test(version)) {
  console.error('Error: Version must be in format v0.0.0');
  process.exit(1);
}

try {
  // Create the tag
  execSync(`git tag -a ${version} -m "${message}"`);
  console.log(`Created tag: ${version}`);
  
  // Update dev-journal.md with the release
  const devJournalPath = path.join(process.cwd(), 'dev-journal.md');
  if (fs.existsSync(devJournalPath)) {
    const today = new Date().toISOString().split('T')[0];
    const releaseEntry = `\n### 🏷️ ${today} – Released ${version}\n- ${message}\n`;
    
    // Find the position to insert (after the Historical Progress section)
    const journalContent = fs.readFileSync(devJournalPath, 'utf8');
    const lines = journalContent.split('\n');
    
    let insertIndex = lines.findIndex(line => line.includes('## 🔄 Historical Progress')) + 1;
    
    // If not found, insert at the beginning after the header
    if (insertIndex <= 0) {
      insertIndex = lines.findIndex(line => line.trim() === '---') + 1;
    }
    
    // Insert the release entry
    lines.splice(insertIndex, 0, releaseEntry);
    fs.writeFileSync(devJournalPath, lines.join('\n'));
    console.log(`Updated dev-journal.md with release ${version}`);
    
    // Add the updated dev-journal.md
    execSync('git add dev-journal.md');
    console.log('Added dev-journal.md to git');
    
    // Commit the changes
    execSync(`git commit -m "Release ${version}: ${message}"`);
    console.log(`Committed release ${version}`);
  }
  
  console.log(`\nTo push the tag to remote, run:\n  git push origin ${version}`);
  console.log(`\nTo push all tags to remote, run:\n  git push --tags`);
} catch (error) {
  console.error('Error creating release:', error.message);
  process.exit(1);
}
