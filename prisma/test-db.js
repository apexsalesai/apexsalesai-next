const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Try to query the database
    const tenantCount = await prisma.tenant.count();
    console.log('Database connection successful!');
    console.log(`Found ${tenantCount} tenants in the database.`);
    
    // List all tenants
    const tenants = await prisma.tenant.findMany();
    console.log('Tenants:', tenants);
    
  } catch (error) {
    console.error('Error connecting to database:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
