import mongoose from 'mongoose';
import User from './models/UserModel.js';

async function checkUser() {
  await mongoose.connect('mongodb+srv://rrhorn:ZSwWJJpdueKHCpQj@cluster0.pkedbef.mongodb.net/hand-hand');
  
  const user = await User.findOne({ email: 'lawayo1524@kimdyn.com' });
  console.log('📊 User-Daten in DB:');
  console.log(JSON.stringify(user, null, 2));
  
  await mongoose.disconnect();
}

checkUser().catch(console.error);
