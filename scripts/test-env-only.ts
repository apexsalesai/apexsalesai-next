import 'dotenv/config';

console.log('Raw DATABASE_URL from environment:');
console.log(process.env.DATABASE_URL);
console.log('\n---\n');
console.log('Length:', process.env.DATABASE_URL?.length);
console.log('Starts with:', process.env.DATABASE_URL?.substring(0, 50));
