import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [step, setStep] = useState(1); // 1: Carrito, 2: Pasarela de Pago
    const { user } = useContext(AuthContext);
    const { showNotification } = useNotification();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchCart();
    }, [user]);

    const fetchCart = async () => {
        try {
            const res = await api.get('/api/cart');
            setCartItems(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleRemove = async (productId) => {
        try {
            await api.delete(`/api/cart/${productId}`);
            showNotification('Item eliminado');
            fetchCart();
        } catch (error) {
            showNotification('Error al eliminar item', 'error');
        }
    };

    const processOrder = async (method) => {
        try {
            await api.post('/api/orders');
            showNotification(`¡Pago con ${method} exitoso!`);
            navigate('/dashboard');
        } catch (error) {
            showNotification('Error al procesar el pedido', 'error');
        }
    };

    const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    if (step === 2) {
        return (
            <div className="container mt-4" style={{ maxWidth: '600px' }}>
                <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: '20px', textDecoration: 'underline' }}>← Volver al carrito</button>
                <h2 className="mb-4 text-center">PASARELA DE PAGO</h2>

                <div style={{ backgroundColor: '#f9f9f9', padding: '30px', border: '1px solid #eee' }}>
                    <p style={{ marginBottom: '25px', textAlign: 'center', fontWeight: '500' }}>TOTAL A PAGAR: $ {total.toLocaleString('es-CO')} COP</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <button className="btn" onClick={() => processOrder('PSE / Nequi')}>
                            PAGAR CON PSE / NEQUI
                        </button>
                        <button className="btn" onClick={() => processOrder('Tarjeta de Crédito')}>
                            TARJETA DE CRÉDITO / DÉBITO
                        </button>
                        <button className="btn" onClick={() => processOrder('Transferencia Directa')}>
                            TRANSFERENCIA BANCARIA
                        </button>
                    </div>

                    <p style={{ marginTop: '30px', fontSize: '0.75rem', color: '#999', textAlign: 'center' }}>
                        * Esta es una interfaz de prueba. En producción, aquí se conectará con Wompi o ePayco.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4" style={{ maxWidth: '800px' }}>
            <h2 className="mb-4 text-center">TU CARRITO</h2>

            {cartItems.length === 0 ? (
                <p className="text-center" style={{ marginTop: '50px' }}>Tu carrito está vacío.</p>
            ) : (
                <>
                    <div style={{ borderTop: '1px solid var(--color-border)' }}>
                        {cartItems.map((item, index) => (
                            <div key={index} className="cart-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid var(--color-border)' }}>
                                <div>
                                    <h4 style={{ fontFamily: 'var(--font-sans)', fontWeight: '600', letterSpacing: '0' }}>{item.product.name}</h4>
                                    <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>Cantidad: {item.quantity}</p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <div style={{ fontWeight: '500' }}>
                                        $ {(item.product.price * item.quantity).toLocaleString('es-CO')} COP
                                    </div>
                                    <button
                                        onClick={() => handleRemove(item.product._id)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', textDecoration: 'underline', color: '#999' }}
                                    >
                                        QUITAR
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary" style={{ marginTop: '40px', textAlign: 'right' }}>
                        <h3 style={{ marginBottom: '20px', fontFamily: 'var(--font-sans)', letterSpacing: '0' }}>TOTAL: $ {total.toLocaleString('es-CO')} COP</h3>
                        <button className="btn btn-solid" style={{ width: 'auto', padding: '15px 40px' }} onClick={() => setStep(2)}>FINALIZAR COMPRA</button>
                    </div>

                </>
            )}
        </div>
    );
};

export default Cart;
