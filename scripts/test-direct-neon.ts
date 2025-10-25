import { Client } from 'pg';

const connectionString = "postgresql://neondb_owner:pg_6Dwv1hS0YKkq@ep-misty-surf-adv6olws-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function testConnection() {
  const client = new Client({ connectionString });
  
  try {
    console.log('🔗 Connecting to Neon (pooler endpoint)...');
    await client.connect();
    console.log('✅ Connected successfully!');
    
    const result = await client.query('SELECT current_user, current_database(), version()');
    console.log('\n📊 Connection details:');
    console.log('   User:', result.rows[0].current_user);
    console.log('   Database:', result.rows[0].current_database);
    console.log('   PostgreSQL:', result.rows[0].version.split(' ').slice(0, 2).join(' '));
    
    await client.end();
    console.log('\n🎉 Test passed! Prisma should work now.');
    process.exit(0);
    
  } catch (error: any) {
    console.error('\n❌ Connection failed:', error.message);
    console.error('\n🔍 Error code:', error.code);
    
    if (error.message.includes('password authentication failed')) {
      console.log('\n⚠️  Password mismatch - the password in the connection string is incorrect.');
    } else if (error.message.includes('no pg_hba.conf entry')) {
      console.log('\n⚠️  IP not allowed - your IP is not in the Neon allowlist.');
    }
    
    await client.end();
    process.exit(1);
  }
}

testConnection();
