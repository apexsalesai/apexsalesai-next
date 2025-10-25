import { Client } from 'pg';

const directUrl = "postgresql://neondb_owner:pg_6Dwv1hS0YKkq@ep-misty-surf-adv6olws.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";
const poolerUrl = "postgresql://neondb_owner:pg_6Dwv1hS0YKkq@ep-misty-surf-adv6olws-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function testEndpoint(url: string, name: string) {
  const client = new Client({ connectionString: url });
  
  try {
    console.log(`\n🔗 Testing ${name}...`);
    await client.connect();
    console.log(`✅ ${name} connected successfully!`);
    
    const result = await client.query('SELECT current_user, version()');
    console.log(`   User: ${result.rows[0].current_user}`);
    console.log(`   Version: ${result.rows[0].version.split(' ').slice(0, 2).join(' ')}`);
    
    await client.end();
    return true;
  } catch (error: any) {
    console.error(`❌ ${name} failed: ${error.message}`);
    console.error(`   Code: ${error.code}`);
    await client.end();
    return false;
  }
}

async function main() {
  console.log('🧪 Testing Neon Connection Methods\n');
  console.log('=' .repeat(50));
  
  const directWorks = await testEndpoint(directUrl, 'DIRECT endpoint');
  const poolerWorks = await testEndpoint(poolerUrl, 'POOLER endpoint');
  
  console.log('\n' + '='.repeat(50));
  console.log('\n📊 Results:');
  console.log(`   Direct: ${directWorks ? '✅ WORKS' : '❌ FAILS'}`);
  console.log(`   Pooler: ${poolerWorks ? '✅ WORKS' : '❌ FAILS'}`);
  
  if (directWorks && !poolerWorks) {
    console.log('\n💡 Solution: Use DIRECT_URL for DATABASE_URL in .env');
  } else if (!directWorks && !poolerWorks) {
    console.log('\n⚠️  Neither works - check IP allowlist or password');
  } else if (directWorks && poolerWorks) {
    console.log('\n🎉 Both work - Prisma should connect!');
  }
}

main();
