/**
 * Raw PostgreSQL connection test (bypasses Prisma)
 */

import 'dotenv/config';
// @ts-ignore
import { Client } from 'pg';

async function testConnection() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🔗 Attempting raw PostgreSQL connection...\n');
    console.log('Host:', process.env.DATABASE_URL?.match(/@([^/]+)/)?.[1]);
    console.log('User:', process.env.DATABASE_URL?.match(/\/\/([^:]+):/)?.[1]);
    console.log('DB:', process.env.DATABASE_URL?.match(/\/([^?]+)\?/)?.[1]);
    console.log('');
    
    await client.connect();
    console.log('✅ Connection successful!\n');
    
    const result = await client.query('SELECT current_database(), current_user, version()');
    console.log('✅ Query successful:');
    console.log('   Database:', result.rows[0].current_database);
    console.log('   User:', result.rows[0].current_user);
    console.log('   Version:', result.rows[0].version.split(' ').slice(0, 2).join(' '));
    
  } catch (error: any) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('password authentication failed')) {
      console.log('\n⚠️  The password is incorrect or the role needs to be reset.');
      console.log('   Please go to Neon Dashboard → Roles → neondb_owner → Reset Password');
    }
  } finally {
    await client.end();
  }
}

testConnection();
