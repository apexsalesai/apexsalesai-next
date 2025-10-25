#!/usr/bin/env node

/**
 * Semantic Version Tagging Script for ApexSalesAI
 * 
 * Usage:
 *   node scripts/tag-version.js [major|minor|patch] [message]
 * 
 * Examples:
 *   node scripts/tag-version.js minor "Added Dataverse OAuth integration"
 *   node scripts/tag-version.js patch "Fixed token refresh bug"
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get the version type from command line args
const versionType = process.argv[2]?.toLowerCase();
const commitMessage = process.argv.slice(3).join(' ') || 'Version bump';

// Validate version type
if (!['major', 'minor', 'patch'].includes(versionType)) {
  console.error('Error: Version type must be one of: major, minor, patch');
  console.log('Usage: node scripts/tag-version.js [major|minor|patch] [message]');
  process.exit(1);
}

// Get the latest tag or start with 0.0.0 if no tags exist
let latestVersion;
try {
  latestVersion = execSync('git describe --tags --abbrev=0 2>/dev/null || echo "v0.0.0"')
    .toString()
    .trim()
    .replace(/^v/, '');
} catch (error) {
  latestVersion = '0.0.0';
}

// Parse the version
const [major, minor, patch] = latestVersion.split('.').map(Number);

// Calculate the new version
let newVersion;
switch (versionType) {
  case 'major':
    newVersion = `${major + 1}.0.0`;
    break;
  case 'minor':
    newVersion = `${major}.${minor + 1}.0`;
    break;
  case 'patch':
    newVersion = `${major}.${minor}.${patch + 1}`;
    break;
}

// Create the tag
const tagName = `v${newVersion}`;
const fullMessage = `${tagName}: ${commitMessage}`;

try {
  // Create and push the tag
  execSync(`git tag -a ${tagName} -m "${fullMessage}"`);
  console.log(`Created tag: ${tagName}`);
  
  // Update dev-journal.md with the release
  const devJournalPath = path.join(process.cwd(), 'dev-journal.md');
  if (fs.existsSync(devJournalPath)) {
    const today = new Date().toISOString().split('T')[0];
    const releaseEntry = `\n### 🏷️ ${today} – Released ${tagName}\n- ${commitMessage}\n`;
    
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
    console.log(`Updated dev-journal.md with release ${tagName}`);
    
    // Add the updated dev-journal.md
    execSync('git add dev-journal.md');
    execSync(`git commit --amend --no-edit`);
  }
  
  console.log(`\nTo push the tag to remote, run:\n  git push origin ${tagName}`);
  console.log(`\nTo push all tags to remote, run:\n  git push --tags`);
} catch (error) {
  console.error('Error creating tag:', error.message);
  process.exit(1);
}
