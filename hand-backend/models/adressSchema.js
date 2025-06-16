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
    strasse: {
        type: String,
        required: true,
    },
    plz: {
        type: String,
        required: true,

    },
    ort: {
        type: String,
        required: true,
    },
    ortsteil: {
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