import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    street: {
        type: String,
        required: true,
    },
    zipCode: {
        type: String,
        required: true,

    },
    city: {
        type: String,
        required: true,
    },
    district: {
        type: String,
        required: false,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});

const Adresse = mongoose.model('Adresse', addressSchema);
export default Adresse;