import dotenv from "dotenv";

console.log('🔍 Current directory:', process.cwd());

// .env laden
const result = dotenv.config();
console.log('📋 dotenv.config() result:', result);

console.log('=== ENVIRONMENT DEBUG ===');
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('PORT:', process.env.PORT);
console.log('========================');

if (process.env.MONGO_URI) {
  console.log('✅ .env loaded successfully');
} else {
  console.log('❌ .env NOT loaded');
  
  // Versuche .env manuell zu lesen
  import fs from 'fs';
  try {
    const envContent = fs.readFileSync('.env', 'utf8');
    console.log('📝 .env file exists and contains:');
    console.log(envContent);
  } catch (error) {
    console.log('❌ Could not read .env file:', error.message);
  }
}
