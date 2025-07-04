import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/userSchema.js';

dotenv.config();

async function debugPasswordReset() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        // Zuerst alle User anzeigen
        const users = await User.find({}, {
            email: 1,
            nickname: 1,
            password: 1,
            resetCode: 1,
            resetCodeExpires: 1,
            isActive: 1,
            isVerify: 1
        });
        
        console.log('\n=== ALLE USER ===');
        users.forEach((user, index) => {
            console.log(`\n${index + 1}. ${user.nickname} (${user.email})`);
            console.log(`   Password Hash Length: ${user.password?.length}`);
            console.log(`   Reset Code: ${user.resetCode || 'Keiner'}`);
            console.log(`   Reset Expires: ${user.resetCodeExpires || 'Keiner'}`);
            console.log(`   Active: ${user.isActive}`);
            console.log(`   Verified: ${user.isVerify}`);
        });
        
        // Wähle den ersten User für den Test
        if (users.length === 0) {
            console.log('\n❌ Keine User in der Datenbank gefunden!');
            return;
        }
        
        const testUser = users[0];
        console.log(`\n🧪 Testing password reset für: ${testUser.nickname} (${testUser.email})`);
        
        // Test 1: Passwort simulieren
        const newPassword = 'TestPasswort123!';
        console.log(`\n📝 Neues Test-Passwort: ${newPassword}`);
        
        // Test 2: Hashen wie in der Reset-Route
        console.log('\n🔐 Hashing password...');
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        console.log(`Hashed password: ${hashedPassword}`);
        console.log(`Hash length: ${hashedPassword.length}`);
        
        // Test 3: Speichern in DB
        console.log('\n💾 Updating user in database...');
        testUser.password = hashedPassword;
        testUser.resetCode = null;
        testUser.resetCodeExpires = null;
        await testUser.save();
        console.log('✅ User saved');
        
        // Test 4: User neu laden
        console.log('\n🔄 Reloading user from database...');
        const reloadedUser = await User.findById(testUser._id);
        console.log(`Reloaded password hash: ${reloadedUser.password}`);
        console.log(`Reloaded hash length: ${reloadedUser.password.length}`);
        console.log(`Hashes match: ${hashedPassword === reloadedUser.password}`);
        
        // Test 5: Login-Simulation
        console.log('\n🔍 Testing login comparison...');
        const loginTest1 = await bcrypt.compare(newPassword, reloadedUser.password);
        console.log(`Login test 1 (correct password): ${loginTest1}`);
        
        const wrongPassword = 'FalschesPasswort123!';
        const loginTest2 = await bcrypt.compare(wrongPassword, reloadedUser.password);
        console.log(`Login test 2 (wrong password): ${loginTest2}`);
        
        // Test 6: Direkter bcrypt-Test
        console.log('\n🧪 Direct bcrypt test...');
        const directHash = await bcrypt.hash(newPassword, 10);
        const directTest = await bcrypt.compare(newPassword, directHash);
        console.log(`Direct bcrypt test: ${directTest}`);
        
        console.log('\n✅ Debug complete');
        console.log('\n📊 SUMMARY:');
        console.log(`- User: ${testUser.nickname} (${testUser.email})`);
        console.log(`- New password: ${newPassword}`);
        console.log(`- Hash saved successfully: ${hashedPassword === reloadedUser.password}`);
        console.log(`- Login test result: ${loginTest1}`);
        console.log(`- bcrypt working: ${directTest}`);
        
        if (!loginTest1) {
            console.log('\n❌ PROBLEM FOUND: Login test failed!');
            console.log('Investigating further...');
            
            // Weitere Debug-Infos
            console.log('\nOriginal hash:', hashedPassword);
            console.log('Reloaded hash:', reloadedUser.password);
            console.log('Hash comparison:', hashedPassword === reloadedUser.password);
            console.log('Original hash type:', typeof hashedPassword);
            console.log('Reloaded hash type:', typeof reloadedUser.password);
        }
        
    } catch (error) {
        console.error('❌ Fehler:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

debugPasswordReset();
