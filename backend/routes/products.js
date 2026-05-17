const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const { storage: cloudinaryStorage } = require('../config/cloudinary');

// Usamos el almacenamiento de Cloudinary si las llaves están configuradas
const upload = multer({
    storage: (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_KEY !== 'tu_api_key')
        ? cloudinaryStorage
        : multer.diskStorage({
            destination: (req, file, cb) => cb(null, 'uploads/'),
            filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.trim().replace(/\s+/g, '-'))
        })
});

// GET /api/products - Buscar catálogo
router.get('/', async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = {};
        if (category) query.category = category;
        if (search) {
            query.$or = [{ name: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];
        }
        const products = await Product.find(query).sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Error obteniendo productos.' });
    }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: 'No encontrado.' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: 'Error.' });
    }
});

// POST /api/products - Crear nuevo producto
router.post('/', authMiddleware, upload.array('images', 5), async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acceso solo para administradores.' });

        const productData = req.body;
        if (req.files && req.files.length > 0) {
            // Cloudinary devuelve 'path' o 'secure_url', local devuelve 'filename'
            productData.images = req.files.map(file => file.path || 'uploads/' + file.filename);
        }

        const product = new Product(productData);
        await product.save();
        res.status(201).json({ message: 'Producto creado exitosamente.', product });
    } catch (error) {
        console.error('Error en POST /api/products:', error);
        res.status(500).json({ error: 'Error creando producto.' });
    }
});

// PUT /api/products/:id - Actualizar
router.put('/:id', authMiddleware, upload.array('images', 5), async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acceso denegado.' });

        const updateData = req.body;
        if (req.files && req.files.length > 0) {
            updateData.images = req.files.map(file => file.path || 'uploads/' + file.filename);
        }

        const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!product) return res.status(404).json({ error: 'Producto no encontrado.' });
        res.json({ message: 'Producto actualizado.', product });
    } catch (error) {
        console.error('Error en PUT /api/products:', error);
        res.status(500).json({ error: 'Error modificando producto.' });
    }
});

// DELETE /api/products/:id
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acceso denegado.' });
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Producto eliminado.' });
    } catch (error) {
        res.status(500).json({ error: 'Error.' });
    }
});

module.exports = router;
