import mongoose from 'mongoose';
import User from './models/userSchema.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const verifyAllUsers = async () => {
  try {
    await connectDB();
    
    // Update all users to be verified and active
    const result = await User.updateMany(
      {}, // Empty filter = update all documents
      { 
        $set: { 
          isVerify: true, 
          isActive: true 
        } 
      }
    );
    
    console.log(`Updated ${result.modifiedCount} users`);
    
    // Show all users after update
    const users = await User.find({}, 'nickname email isVerify isActive');
    console.log('\nAll users after verification:');
    users.forEach(user => {
      console.log(`- ${user.nickname}: ${user.email} (Verified: ${user.isVerify}, Active: ${user.isActive})`);
    });
    
  } catch (error) {
    console.error('Error verifying users:', error);
  } finally {
    mongoose.connection.close();
  }
};

verifyAllUsers();
