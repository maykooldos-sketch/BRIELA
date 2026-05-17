const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');

// GET /api/cart
router.get('/', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('cart.product');
        res.json(user.cart);
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo carrito.' });
    }
});

// POST /api/cart
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { product_id, quantity = 1 } = req.body;
        const user = await User.findById(req.user.id);

        const itemIndex = user.cart.findIndex(i => i.product.toString() === product_id);
        if (itemIndex > -1) {
            user.cart[itemIndex].quantity += quantity;
        } else {
            user.cart.push({ product: product_id, quantity });
        }
        await user.save();
        res.json({ message: 'Carrito actualizado.' });
    } catch (error) {
        res.status(500).json({ error: 'Error agregando al carrito.' });
    }
});

// DELETE /api/cart/:productId - Eliminar item del carrito
router.delete('/:productId', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.cart = user.cart.filter(item => item.product.toString() !== req.params.productId);
        await user.save();
        res.json({ message: 'Item eliminado del carrito.' });
    } catch (error) {
        res.status(500).json({ error: 'Error eliminando item.' });
    }
});

module.exports = router;
