import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import { useModal } from '../context/ModalContext';

const Dashboard = () => {
    const [orders, setOrders] = useState([]);
    const { user } = useContext(AuthContext);
    const { showNotification } = useNotification();
    const { showConfirm } = useModal();
    const navigate = useNavigate();

    const fetchOrders = async () => {
        try {
            const res = await api.get('/api/orders');
            setOrders(res.data);
        } catch (error) {
            console.error('Error fetching orders', error);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchOrders();
    }, [user]);

    const cancelOrder = (id) => {
        showConfirm(
            'Confirmar Cancelación',
            '¿Estás seguro de que deseas cancelar este pedido? Esta acción no se puede deshacer.',
            async () => {
                try {
                    await api.delete(`/api/orders/${id}`);
                    showNotification('Pedido cancelado con éxito');
                    fetchOrders();
                } catch (error) {
                    showNotification('No se pudo cancelar el pedido', 'error');
                }
            }
        );
    };

    if (!user) return null;

    return (
        <div className="container mt-4" style={{ maxWidth: '800px' }}>
            <h2 className="mb-4 text-center">BIENVENIDO, {user.name.split(' ')[0].toUpperCase()}</h2>

            <div style={{ marginTop: '50px' }}>
                <h3 style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '15px', marginBottom: '30px' }}>HISTORIAL DE PEDIDOS</h3>

                {orders.length === 0 ? (
                    <p style={{ color: 'var(--color-text-light)' }}>Aún no has realizado ningún pedido.</p>
                ) : (
                    orders.map(order => (
                        <div key={order._id} style={{ border: '1px solid var(--color-border)', padding: '20px', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px solid var(--color-border)', paddingBottom: '15px' }}>
                                <div>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pedido #{order._id.slice(-6).toUpperCase()}</span>
                                    <div style={{ fontSize: '0.85rem', marginTop: '5px' }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ display: 'inline-block', padding: '5px 10px', backgroundColor: order.status === 'pendiente' ? '#fafafa' : '#000', color: order.status === 'pendiente' ? '#000' : '#fff', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                        {order.status}
                                    </span>
                                    {order.status === 'pendiente' && (
                                        <button
                                            onClick={() => cancelOrder(order._id)}
                                            style={{ display: 'block', width: '100%', marginTop: '10px', background: 'none', border: 'none', color: '#999', fontSize: '0.65rem', textDecoration: 'underline', cursor: 'pointer' }}
                                        >
                                            CANCELAR PEDIDO
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div>
                                {order.items.map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '10px' }}>
                                        <span>{item.quantity}x {item.product ? item.product.name : 'Producto Eliminado'}</span>
                                        <span>$ {(item.price * item.quantity).toLocaleString('es-CO')}</span>
                                    </div>
                                ))}

                                {order.trackingId && (
                                    <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f9f9f9', borderLeft: '3px solid #000', fontSize: '0.85rem' }}>
                                        <strong>INFORMACIÓN DE ENVÍO:</strong><br />
                                        Transportadora: {order.carrier}<br />
                                        N° de Guía: <span style={{ textDecoration: 'underline' }}>{order.trackingId}</span>
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', paddingTop: '15px', borderTop: '1px solid var(--color-border)', fontWeight: '600' }}>
                                <span>TOTAL</span>
                                <span>$ {order.total.toLocaleString('es-CO')} COP</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Dashboard;
