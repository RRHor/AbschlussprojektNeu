import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// ES Module setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env') });

// Import User model
import User from './models/userSchema.js';

async function resetPasswords() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Hash new passwords
        const newPassword = 'test123'; // Simple password for testing
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update Maus password
        const mausResult = await User.updateOne(
            { email: 'piwex46309@iridales.com' },
            { password: hashedPassword }
        );
        console.log('Maus password updated:', mausResult);

        // Update Posel password
        const poselResult = await User.updateOne(
            { email: 'wopahad372@iridales.com' },
            { password: hashedPassword }
        );
        console.log('Posel password updated:', poselResult);

        console.log('\n✅ Passwords reset successfully!');
        console.log('New password for both Maus and Posel: test123');
        console.log('\nLogin credentials:');
        console.log('Maus: piwex46309@iridales.com / test123');
        console.log('Posel: wopahad372@iridales.com / test123');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

resetPasswords();
