/**
 * Quick database connection test
 */

import 'dotenv/config';

console.log('🔍 Environment Check:\n');
console.log('DATABASE_URL present:', !!process.env.DATABASE_URL);
console.log('DATABASE_URL host:', process.env.DATABASE_URL?.match(/@([^/]+)/)?.[1] || 'NOT FOUND');
console.log('DATABASE_URL user:', process.env.DATABASE_URL?.match(/\/\/([^:]+):/)?.[1] || 'NOT FOUND');
console.log('DATABASE_URL password length:', process.env.DATABASE_URL?.match(/:([^@]+)@/)?.[1]?.length || 0);
console.log('DATABASE_URL database:', process.env.DATABASE_URL?.match(/\/([^?]+)/)?.[1] || 'NOT FOUND');

console.log('\n🔗 Attempting connection test...\n');

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Try a simple query
    const result = await prisma.$queryRaw`SELECT current_database(), current_user, version()`;
    console.log('✅ Query test successful:', result);
    
  } catch (error: any) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('password authentication failed')) {
      console.log('\n⚠️  Password authentication failed. Please verify:');
      console.log('   1. The password in .env matches the Neon dashboard');
      console.log('   2. The role "neondb_owner" has not been reset');
      console.log('   3. Try resetting the password in Neon: Roles → neondb_owner → Reset Password');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
