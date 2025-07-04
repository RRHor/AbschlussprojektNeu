import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from './models/userSchema.js';

// MongoDB-Verbindung
await mongoose.connect('mongodb://localhost:27017/handinhand');

console.log('🔍 Debug: Password Reset Test');

// Test-Funktion für Passwort-Hashing
async function testPasswordHashing() {
  const testPassword = 'NeuesPasswort123!';
  
  console.log('\n📝 Testing password hashing:');
  console.log('Original password:', testPassword);
  
  // Hashen wie in der Reset-Route
  const hashedPassword = await bcrypt.hash(testPassword, 10);
  console.log('Hashed password:', hashedPassword);
  console.log('Hash length:', hashedPassword.length);
  
  // Vergleichen wie in der Login-Route
  const isMatch = await bcrypt.compare(testPassword, hashedPassword);
  console.log('Comparison result:', isMatch);
  
  return { testPassword, hashedPassword };
}

// Test-Funktion für User-Update
async function testUserUpdate(email) {
  console.log('\n👤 Testing user update for:', email);
  
  const user = await User.findOne({ email });
  if (!user) {
    console.log('❌ User not found');
    return;
  }
  
  console.log('User found:', user.nickname);
  console.log('Current password hash:', user.password);
  console.log('Current hash length:', user.password?.length);
  
  const { testPassword, hashedPassword } = await testPasswordHashing();
  
  // Passwort updaten
  user.password = hashedPassword;
  await user.save();
  
  console.log('✅ Password updated');
  
  // User neu laden und prüfen
  const updatedUser = await User.findOne({ email });
  console.log('Updated password hash:', updatedUser.password);
  console.log('Updated hash length:', updatedUser.password?.length);
  
  // Test login
  const loginMatch = await bcrypt.compare(testPassword, updatedUser.password);
  console.log('Login test result:', loginMatch);
  
  return { testPassword, updatedUser };
}

// Alle User anzeigen für Debug
async function showUsers() {
  console.log('\n📋 All users in database:');
  const users = await User.find({}, 'nickname email password resetCode resetCodeExpires');
  users.forEach(user => {
    console.log(`- ${user.nickname} (${user.email})`);
    console.log(`  Password hash length: ${user.password?.length}`);
    console.log(`  Reset code: ${user.resetCode}`);
    console.log(`  Reset expires: ${user.resetCodeExpires}`);
    console.log('');
  });
}

// Main test
async function main() {
  try {
    await showUsers();
    
    // Testen Sie mit einer echten E-Mail eines Users
    // Ersetzen Sie diese durch eine echte E-Mail aus der Datenbank
    const testEmail = 'test@example.com'; // ANPASSEN!
    
    console.log('\n🧪 Starting password reset test...');
    await testUserUpdate(testEmail);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

main();
