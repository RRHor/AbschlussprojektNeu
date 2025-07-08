import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // console.log('🔄 Verbinde mit MongoDB...');
    // console.log('📍 MongoDB URI:', process.env.MONGO_URI ? 'URI vorhanden' : 'URI FEHLT!');
    
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI ist nicht in der .env-Datei definiert');
    }
    
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    console.log('✅ Mit MongoDB verbunden:');
    // console.log('📊 Database Name:', conn.connection.name);
    
    // Connection Event Listeners
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB Verbindungsfehler:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB Verbindung getrennt');
    });
    
  } catch (error) {
    console.error('❌ MongoDB Verbindungsfehler:', error.message);
    process.exit(1);
  }
};

export default connectDB;

// server.js - Nach connectDB() hinzufügen:

