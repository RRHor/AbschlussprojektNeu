import mongoose from 'mongoose';

const adressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  district: { type: String, required: true },
  zip: { type: Number, required: true }
});

const Adress = mongoose.models.Adress || mongoose.model('Adress', adressSchema);
export default Adress;