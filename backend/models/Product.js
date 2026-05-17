const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true },
    images: [{ type: String }] // Ahora permitimos múltiples imágenes
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
