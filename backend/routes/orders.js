const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const authMiddleware = require('../middleware/auth');
const { sendOrderEmail } = require('../utils/emailService');

// GET /api/orders (CLIENTE) - Ver mis pedidos
router.get('/', authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).populate('items.product').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener pedidos.' });
    }
});

// POST /api/orders (CLIENTE) - Crear pedido
router.post('/', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('cart.product');
        if (!user.cart || user.cart.length === 0) return res.status(400).json({ error: 'Carrito vacío.' });

        let total = 0;
        const orderItems = user.cart.map(item => {
            total += item.product.price * item.quantity;
            return { product: item.product._id, quantity: item.quantity, price: item.product.price };
        });

        const order = new Order({ user: req.user.id, items: orderItems, total });
        await order.save();

        // Enviar Email (Sincrónico pero no bloqueante del response)
        const fullOrder = await Order.findById(order._id).populate('items.product');
        sendOrderEmail(fullOrder, user);

        user.cart = [];
        await user.save();

        res.status(201).json({ message: 'Pedido creado exitosamente', order_id: order._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creando pedido.' });
    }
});

/* =========================================================
   RUTAS DE ADMINISTRADOR (Gestión y Seguimiento)
========================================================= */

// GET /api/orders/all (ADMIN) - Ver todos los pedidos de la tienda
router.get('/all', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acceso delegido.' });
        const orders = await Order.find().populate('user', 'name email').populate('items.product').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo sistema de pedidos.' });
    }
});

// PUT /api/orders/:id/status (ADMIN) - Actualizar el seguimiento del pedido
router.put('/:id/status', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acceso denegado.' });

        const { status, trackingId, carrier } = req.body;
        // status validos: ['pendiente', 'pagado', 'enviado', 'entregado']

        const updateFields = { status };
        if (trackingId !== undefined) updateFields.trackingId = trackingId;
        if (carrier !== undefined) updateFields.carrier = carrier;

        const order = await Order.findByIdAndUpdate(req.params.id, updateFields, { new: true }).populate('user', 'name email');
        if (!order) return res.status(404).json({ error: 'Pedido no encontrado.' });

        // Enviar notificación de estado
        if (order.user) {
            const { sendStatusUpdateEmail } = require('../utils/emailService');
            sendStatusUpdateEmail(order, order.user);
        }

        res.json({ message: `Estado actualizado a ${status || order.status}.`, order });
    } catch (error) {
        res.status(500).json({ error: 'Error actualizando el estado.' });
    }
});

// DELETE /api/orders/:id - Eliminar pedido
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ error: 'Pedido no encontrado' });

        // Solo el admin o el usuario dueño puede borrar? 
        // Por seguridad, permitamos solo al admin en este punto o si el pedido está 'pendiente'
        if (req.user.role !== 'admin' && order.user.toString() !== req.user.id) {
            return res.status(403).json({ error: 'No autorizado' });
        }

        await Order.findByIdAndDelete(req.params.id);
        res.json({ message: 'Pedido eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar pedido' });
    }
});

module.exports = router;
