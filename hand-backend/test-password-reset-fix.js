import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/userSchema.js';

dotenv.config();

async function testPasswordResetFix() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');
        
        // Testuser erstellen oder existierenden verwenden
        let testUser = await User.findOne({ email: 'test@passwordreset.com' });
        
        if (!testUser) {
            console.log('📝 Creating test user...');
            testUser = new User({
                nickname: 'PasswordTestUser',
                email: 'test@passwordreset.com',
                password: 'AltesPasworrt123!', // Das wird automatisch gehasht
                addresses: [{
                    street: 'Teststraße 1',
                    city: 'Teststadt',
                    district: 'Testbezirk',
                    zipCode: 12345,
                    state: 'Testland'
                }],
                isVerify: true,
                isActive: true
            });
            await testUser.save();
            console.log('✅ Test user created');
        }
        
        // Test user neu laden
        testUser = await User.findOne({ email: 'test@passwordreset.com' });
        console.log(`\n👤 Test User: ${testUser.nickname} (${testUser.email})`);
        console.log(`Original password hash: ${testUser.password}`);
        console.log(`Original hash length: ${testUser.password.length}`);
        
        // Altes Passwort testen
        const oldPassword = 'AltesPasworrt123!';
        const oldPasswordWorks = await bcrypt.compare(oldPassword, testUser.password);
        console.log(`\n🔍 Old password works: ${oldPasswordWorks}`);
        
        // Passwort-Reset simulieren
        console.log('\n🔄 Simulating password reset...');
        const newPassword = 'NeuesPasswort123!';
        const resetCode = '123456';
        
        // Reset-Code setzen
        testUser.resetCode = resetCode;
        testUser.resetCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 Minuten
        await testUser.save();
        
        // Password-Reset Route simulieren
        console.log('📧 Simulating password reset route...');
        
        // User mit Reset-Code finden
        const userWithCode = await User.findOne({ 
            email: testUser.email, 
            resetCode,
            resetCodeExpires: { $gt: Date.now() }
        });
        
        if (!userWithCode) {
            console.log('❌ User with reset code not found!');
            return;
        }
        
        console.log('✅ User found with valid reset code');
        
        // Neues Passwort hashen und speichern (wie in der Reset-Route)
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        console.log(`New hashed password: ${hashedNewPassword}`);
        console.log(`New hash length: ${hashedNewPassword.length}`);
        
        userWithCode.password = hashedNewPassword;
        userWithCode.resetCode = null;
        userWithCode.resetCodeExpires = null;
        
        const savedUser = await userWithCode.save();
        console.log(`\n💾 User saved with new password hash: ${savedUser.password}`);
        console.log(`Final hash length: ${savedUser.password.length}`);
        
        // Test: Neues Passwort funktioniert
        const newPasswordWorks = await bcrypt.compare(newPassword, savedUser.password);
        console.log(`\n🔍 New password works: ${newPasswordWorks}`);
        
        // Test: Altes Passwort funktioniert nicht mehr
        const oldPasswordStillWorks = await bcrypt.compare(oldPassword, savedUser.password);
        console.log(`🔍 Old password still works: ${oldPasswordStillWorks}`);
        
        // Login-Route simulieren
        console.log('\n🔐 Simulating login route...');
        const loginUser = await User.findOne({ email: testUser.email });
        const loginSuccess = await bcrypt.compare(newPassword, loginUser.password);
        console.log(`Login simulation result: ${loginSuccess}`);
        
        console.log('\n📊 SUMMARY:');
        console.log(`- Password reset: ${newPasswordWorks ? '✅ SUCCESS' : '❌ FAILED'}`);
        console.log(`- Old password blocked: ${!oldPasswordStillWorks ? '✅ SUCCESS' : '❌ FAILED'}`);
        console.log(`- Login works: ${loginSuccess ? '✅ SUCCESS' : '❌ FAILED'}`);
        
        if (newPasswordWorks && !oldPasswordStillWorks && loginSuccess) {
            console.log('\n🎉 PASSWORD RESET FIX WORKING!');
        } else {
            console.log('\n❌ Still has issues...');
        }
        
        // Cleanup
        console.log('\n🧹 Cleaning up test user...');
        await User.deleteOne({ email: 'test@passwordreset.com' });
        console.log('✅ Test user deleted');
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

testPasswordResetFix();
