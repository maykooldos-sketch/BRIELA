import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import api, { API_URL } from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';

const Favoritos = () => {
    const [wishlist, setWishlist] = useState([]);
    const { user } = useContext(AuthContext);
    const { showNotification } = useNotification();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchWishlist();
    }, [user]);

    const fetchWishlist = async () => {
        try {
            const res = await api.get('/api/wishlist');
            setWishlist(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const removeFromWishlist = async (productId, e) => {
        if (e) e.preventDefault();
        try {
            await api.post(`/api/wishlist/${productId}`);
            showNotification('Eliminado de favoritos');
            fetchWishlist();
        } catch (error) {
            showNotification('Error al eliminar de favoritos', 'error');
        }
    };

    const addToCart = async (productId, e) => {
        if (e) e.preventDefault();
        try {
            await api.post('/api/cart', { product_id: productId, quantity: 1 });
            showNotification('Añadido al carrito');
        } catch (error) {
            showNotification('Error al añadir al carrito', 'error');
        }
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center" style={{ padding: '60px 0 20px', letterSpacing: '0.15em' }}>
                MIS FAVORITOS
            </h1>

            {wishlist.length === 0 ? (
                <div className="text-center" style={{ padding: '50px 0', color: 'var(--color-text-light)' }}>
                    Aún no has guardado ninguna joya en tus favoritos.
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
                    {wishlist.map(product => (
                        <div key={product._id} className="product-card" style={{ position: 'relative', textAlign: 'center' }}>
                            <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div style={{
                                    width: '100%',
                                    height: '350px',
                                    backgroundColor: '#fafafa',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid var(--color-border)',
                                    overflow: 'hidden'
                                }}>
                                    {product.images && product.images.length > 0 ? (
                                        <img
                                            src={product.images[0].startsWith('http') ? product.images[0] : `${API_URL}/${product.images[0]}`}
                                            alt={product.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <span>[ Imagen de {product.name} ]</span>
                                    )}
                                </div>
                                <div style={{ padding: '15px 0' }}>
                                    <p style={{ fontSize: '0.7rem', color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '5px' }}>{product.category}</p>
                                    <h3 style={{ textTransform: 'uppercase', fontSize: '1rem', letterSpacing: '0.1em' }}>{product.name}</h3>
                                    <p style={{ color: 'var(--color-text-light)', marginTop: '5px' }}>$ {product.price.toLocaleString('es-CO')} COP</p>
                                </div>
                            </Link>

                            <button
                                onClick={(e) => removeFromWishlist(product._id, e)}
                                style={{
                                    position: 'absolute',
                                    top: '15px',
                                    right: '15px',
                                    background: 'rgba(255,255,255,0.8)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '35px',
                                    height: '35px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    fontSize: '1.2rem',
                                    color: '#ff4d4d'
                                }}
                            >
                                QUITAR
                            </button>

                            <button className="btn btn-outline" style={{ marginTop: '10px' }} onClick={(e) => addToCart(product._id, e)}>AÑADIR AL CARRITO</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favoritos;
