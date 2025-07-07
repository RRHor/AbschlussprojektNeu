import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/userSchema.js';

dotenv.config();

async function verifyAllUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        // Alle User auf verifiziert setzen
        const result = await User.updateMany(
            { isVerified: false },
            { isVerified: true }
        );
        
        console.log(`${result.modifiedCount} User wurden verifiziert!`);
        
        // Nochmal alle User anzeigen
        const users = await User.find({}, {
            email: 1,
            nickname: 1,
            isVerified: 1
        });
        
        console.log('\n=== VERIFIZIERTE USER ===');
        users.forEach((user) => {
            console.log(`${user.nickname}: ${user.email} - Verifiziert: ${user.isVerified}`);
        });
        
    } catch (error) {
        console.error('Fehler:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

verifyAllUsers();
