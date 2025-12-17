#!/usr/bin/env node

/**
 * Environment Validation Script
 * Runs before dev/build to ensure required environment variables are set
 */

// Load environment variables from .env.local
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    // Skip comments and empty lines
    line = line.trim();
    if (!line || line.startsWith('#')) return;
    
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      // Remove surrounding quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

const requiredEnvVars = [
  'ANTHROPIC_API_KEY',
  'BRAVE_SEARCH_API_KEY',
  'NEXT_PUBLIC_BASE_URL',
];

const optionalEnvVars = [
  'ANTHROPIC_MODEL',
  'ANTHROPIC_API_VERSION',
];

console.log('\n🔍 Validating environment variables...\n');

let hasErrors = false;

// Check required variables
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  
  if (!value) {
    console.error(`❌ ${varName}: MISSING (required)`);
    hasErrors = true;
  } else {
    // Show preview of the value (first 15 chars for keys, full for URLs)
    const preview = varName.includes('KEY') 
      ? value.substring(0, 15) + '...'
      : value;
    console.log(`✅ ${varName}: ${preview}`);
  }
});

// Check optional variables
optionalEnvVars.forEach(varName => {
  const value = process.env[varName];
  
  if (value) {
    console.log(`✅ ${varName}: ${value}`);
  } else {
    console.log(`⚠️  ${varName}: not set (optional)`);
  }
});

console.log('\n✅ Environment validated.\n');

if (hasErrors) {
  console.error('❌ Missing required environment variables. Please check your .env.local file.\n');
  process.exit(1);
}

process.exit(0);
