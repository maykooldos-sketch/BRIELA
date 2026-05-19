const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conectado a MongoDB.');

        await Product.deleteMany();

        const sampleProducts = [
            {
                name: 'Anillo Aura Diamante',
                description: 'Anillo en oro blanco de 18k con diamante central de corte brillante. Una pieza eterna de elegancia pura.',
                price: 1850000,
                category: 'anillos',
                stock: 5,
                images: ['https://images.unsplash.com/photo-1605100869064-c70438330752?auto=format&fit=crop&q=80&w=800']
            },
            {
                name: 'Collar Perlas de Luna',
                description: 'Collar de perlas cultivadas con broche de plata 950. El equilibrio perfecto entre lo clásico y lo moderno.',
                price: 450000,
                category: 'collares',
                stock: 10,
                images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800']
            },
            {
                name: 'Pulsera Eslabón Real',
                description: 'Pulsera de eslabones gruesos en baño de oro de 24k. Diseño audaz para una presencia inolvidable.',
                price: 320000,
                category: 'pulseras',
                stock: 15,
                images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800']
            },
            {
                name: 'Aretes Gota de Cristal',
                description: 'Aretes largos con cristales Swarovski transparentes y base de rodio. Brillan con luz propia.',
                price: 180000,
                category: 'aretes',
                stock: 8,
                images: ['https://images.unsplash.com/photo-1535633302703-b37017426ceb?auto=format&fit=crop&q=80&w=800']
            }
        ];

        await Product.insertMany(sampleProducts);
        console.log('Inventario inyectado correctamente.');
        process.exit();
    } catch (error) {
        console.error('Error inyectando inventario:', error.message);
        process.exit(1);
    }
};

seedProducts();
