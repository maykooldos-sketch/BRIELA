const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Conectado a MongoDB local.');

        // Limpiamos los productos de prueba que hubieran antes
        await Product.deleteMany();

        const sampleProducts = [
            {
                name: 'Pulsera Trace Three',
                description: 'Pulsera tenis elaborada en Plata ley 925 que incorpora tres esmeraldas naturales colombianas como eje central del diseño.',
                price: 245000,
                category: 'pulseras',
                stock: 12
            },
            {
                name: 'Anillo Eclipse Noir',
                description: 'Anillo arquitectónico con diseño continuo en Plata 950 y circones negros puros en corte princesa.',
                price: 180000,
                category: 'anillos',
                stock: 5
            },
            {
                name: 'Collar Crescent',
                description: 'Cadena sutil estilo figaro. Colgante lunar en doble plano mate-brillante con engaste minimalista.',
                price: 210000,
                category: 'collares',
                stock: 20
            }
        ];

        await Product.insertMany(sampleProducts);
        console.log('✅ 3 Productos Lujosos inyectados correctamente.');
        process.exit();
    } catch (error) {
        console.error('❌ Error inyectando inventario. ¿Aseguraste que MongoDB esté encendido localmente?', error.message);
        process.exit(1);
    }
};

seedProducts();
