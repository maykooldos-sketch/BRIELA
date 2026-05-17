const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// GET /api/wishlist - Obtener lista de deseos
router.get('/', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('wishlist');
        res.json(user.wishlist);
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo favoritos.' });
    }
});

// POST /api/wishlist/:productId - Alternar (agregar/quitar) de favoritos
router.post('/:productId', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const productId = req.params.productId;

        const index = user.wishlist.indexOf(productId);
        if (index > -1) {
            user.wishlist.splice(index, 1);
            await user.save();
            return res.json({ message: 'Eliminado de favoritos', action: 'removed' });
        } else {
            user.wishlist.push(productId);
            await user.save();
            return res.json({ message: 'Añadido a favoritos', action: 'added' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error actualizando favoritos.' });
    }
});

module.exports = router;
