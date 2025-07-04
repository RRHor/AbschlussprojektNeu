import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/userSchema.js';

dotenv.config();

async function debugUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        const users = await User.find({}, {
            username: 1,
            email: 1,
            nickname: 1,
            isVerified: 1,
            password: 1,
            resetCode: 1,
            resetCodeExpires: 1,
            createdAt: 1
        }).sort({ createdAt: -1 });
        
        console.log('\n=== ALLE USER IN DER DATENBANK ===');
        users.forEach((user, index) => {
            console.log(`\n${index + 1}. User:`);
            console.log(`   ID: ${user._id}`);
            console.log(`   Username: ${user.username}`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Nickname: ${user.nickname || 'Nicht gesetzt'}`);
            console.log(`   Verifiziert: ${user.isVerified ? 'JA' : 'NEIN'}`);
            console.log(`   Password Hash Length: ${user.password?.length || 'Kein Passwort'}`);
            console.log(`   Reset Code: ${user.resetCode || 'Keiner'}`);
            console.log(`   Reset Expires: ${user.resetCodeExpires || 'Keiner'}`);
            console.log(`   Erstellt: ${user.createdAt}`);
        });
        
        console.log(`\nGesamt: ${users.length} User gefunden`);
        
    } catch (error) {
        console.error('Fehler:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

debugUsers();
