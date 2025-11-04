// Quick test script for Phase 2.6 publish adapters
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('\n🧪 Phase 2.6 Publish Adapter Test\n');

  // Get sample assets
  const assets = await prisma.contentAsset.findMany({
    take: 5,
    select: {
      id: true,
      type: true,
      title: true,
      body: true,
    },
  });

  console.log('📋 Available Assets for Testing:\n');
  assets.forEach((asset, i) => {
    console.log(`${i + 1}. ${asset.type.toUpperCase()} - ${asset.title}`);
    console.log(`   ID: ${asset.id}`);
    console.log(`   Body length: ${asset.body?.length || 0} chars\n`);
  });

  // Test Blog Adapter (no credentials needed)
  const blogAsset = assets.find(a => a.type === 'blog');
  if (blogAsset) {
    console.log('🧪 Testing Blog Adapter...');
    console.log(`\nTest command:\ncurl -X POST http://localhost:3004/api/publish/blog -H "Content-Type: application/json" -d "{\\"assetId\\":\\"${blogAsset.id}\\",\\"title\\":\\"${blogAsset.title}\\"}"
`);
  }

  // Test Email Adapter
  const emailAsset = assets.find(a => a.type === 'email');
  if (emailAsset) {
    console.log('📧 Testing Email Adapter...');
    console.log(`\nTest command:\ncurl -X POST http://localhost:3004/api/publish/email -H "Content-Type: application/json" -d "{\\"assetId\\":\\"${emailAsset.id}\\",\\"to\\":\\"test@example.com\\",\\"subject\\":\\"${emailAsset.title}\\"}"
`);
  }

  // Test Social Adapters
  const socialAsset = assets.find(a => a.type === 'social');
  if (socialAsset) {
    const shortText = socialAsset.body?.substring(0, 280) || 'Test post';
    console.log('🔗 Testing LinkedIn Adapter...');
    console.log(`\nTest command:\ncurl -X POST http://localhost:3004/api/publish/linkedin -H "Content-Type: application/json" -d "{\\"assetId\\":\\"${socialAsset.id}\\",\\"text\\":\\"${shortText}\\"}"
`);
    
    console.log('\n🐦 Testing X/Twitter Adapter...');
    console.log(`\nTest command:\ncurl -X POST http://localhost:3004/api/publish/x -H "Content-Type: application/json" -d "{\\"assetId\\":\\"${socialAsset.id}\\",\\"text\\":\\"${shortText}\\"}"
`);
  }

  console.log('\n✅ Test script complete. Run the curl commands above to test each adapter.\n');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
