const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');

const setup = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const email = 'admin@briela.com';

        // Remove if exists
        await User.deleteOne({ email });

        // Create new admin
        const hash = await bcrypt.hash('admin123', 10);
        await User.create({
            name: 'Master Admin',
            email: email,
            password: hash,
            role: 'admin'
        });

        console.log('✅ CREADO CORRECTAMENTE EL ADMIN');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

setup();
