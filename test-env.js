require('dotenv').config();
console.log('OPENAI_API_KEY present?', !!process.env.OPENAI_API_KEY);
if (process.env.OPENAI_API_KEY) {
  console.log('Value starts with:', process.env.OPENAI_API_KEY.substring(0, 15) + '...');
} else {
  console.log('Value: MISSING - Please add your actual OpenAI API key to .env');
}
