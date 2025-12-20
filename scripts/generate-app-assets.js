#!/usr/bin/env node

/**
 * Generate App Assets Script
 *
 * This script generates all required app assets for iOS and Android.
 *
 * Requirements:
 * - Node.js 18+
 * - sharp package for image processing
 *
 * Usage:
 * node scripts/generate-app-assets.js --logo path/to/logo.png
 *
 * Or with a URL:
 * node scripts/generate-app-assets.js --url https://example.com/logo.png
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Asset specifications
const ASSETS = {
  'icon.png': { width: 1024, height: 1024, description: 'App icon' },
  'adaptive-icon.png': { width: 1024, height: 1024, description: 'Android adaptive icon' },
  'splash.png': { width: 1284, height: 2778, description: 'Splash screen' },
  'favicon.png': { width: 48, height: 48, description: 'Web favicon' },
};

const ASSETS_DIR = path.join(__dirname, '../mobile/assets');

async function checkDependencies() {
  try {
    require('sharp');
    return true;
  } catch (err) {
    console.log('📦 Installing sharp for image processing...');
    try {
      await execAsync('npm install --save-dev sharp');
      return true;
    } catch (installErr) {
      console.error('❌ Failed to install sharp:', installErr.message);
      return false;
    }
  }
}

async function downloadImage(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {});
      reject(err);
    });
  });
}

async function generateAssets(logoPath) {
  const sharp = require('sharp');

  console.log('🎨 Generating app assets from:', logoPath);
  console.log('');

  // Ensure assets directory exists
  if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
  }

  for (const [filename, spec] of Object.entries(ASSETS)) {
    const outputPath = path.join(ASSETS_DIR, filename);

    try {
      await sharp(logoPath)
        .resize(spec.width, spec.height, {
          fit: 'contain',
          background: { r: 15, g: 23, b: 42, alpha: 1 } // #0f172a
        })
        .png()
        .toFile(outputPath);

      console.log(`✅ Generated ${filename} (${spec.width}x${spec.height}) - ${spec.description}`);
    } catch (err) {
      console.error(`❌ Failed to generate ${filename}:`, err.message);
    }
  }

  console.log('');
  console.log('🎉 Asset generation complete!');
  console.log('');
  console.log('📁 Assets saved to:', ASSETS_DIR);
  console.log('');
  console.log('Next steps:');
  console.log('1. Review the generated assets');
  console.log('2. Replace with custom designs if needed');
  console.log('3. Run: npm run mobile:start');
}

async function createPlaceholderAssets() {
  console.log('🎨 Creating placeholder assets...');
  console.log('');
  console.log('⚠️  No logo provided. Creating simple placeholder assets.');
  console.log('   These are NOT production-ready!');
  console.log('');

  const sharp = require('sharp');

  // Ensure assets directory exists
  if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
  }

  for (const [filename, spec] of Object.entries(ASSETS)) {
    const outputPath = path.join(ASSETS_DIR, filename);

    try {
      // Create a simple gradient placeholder
      await sharp({
        create: {
          width: spec.width,
          height: spec.height,
          channels: 4,
          background: { r: 99, g: 102, b: 241, alpha: 1 } // #6366f1
        }
      })
        .png()
        .toFile(outputPath);

      console.log(`✅ Created placeholder ${filename} (${spec.width}x${spec.height})`);
    } catch (err) {
      console.error(`❌ Failed to create ${filename}:`, err.message);
    }
  }

  console.log('');
  console.log('⚠️  IMPORTANT: Replace these placeholders with your actual logo!');
  console.log('');
  console.log('To generate from your logo:');
  console.log('  node scripts/generate-app-assets.js --logo path/to/logo.png');
  console.log('');
}

async function main() {
  const args = process.argv.slice(2);

  console.log('');
  console.log('═══════════════════════════════════════════');
  console.log('  Echo Breaker - App Assets Generator');
  console.log('═══════════════════════════════════════════');
  console.log('');

  // Check for sharp
  const hasSharp = await checkDependencies();
  if (!hasSharp) {
    console.error('❌ Cannot proceed without sharp package');
    process.exit(1);
  }

  // Parse arguments
  const logoIndex = args.indexOf('--logo');
  const urlIndex = args.indexOf('--url');

  if (logoIndex !== -1 && args[logoIndex + 1]) {
    const logoPath = args[logoIndex + 1];
    if (!fs.existsSync(logoPath)) {
      console.error(`❌ Logo file not found: ${logoPath}`);
      process.exit(1);
    }
    await generateAssets(logoPath);
  } else if (urlIndex !== -1 && args[urlIndex + 1]) {
    const logoUrl = args[urlIndex + 1];
    const tempPath = path.join(ASSETS_DIR, 'temp-logo.png');

    console.log('⬇️  Downloading logo from:', logoUrl);
    try {
      await downloadImage(logoUrl, tempPath);
      await generateAssets(tempPath);
      fs.unlinkSync(tempPath);
    } catch (err) {
      console.error('❌ Failed to download logo:', err.message);
      process.exit(1);
    }
  } else {
    // Create placeholders for development
    await createPlaceholderAssets();
  }
}

main().catch(console.error);
