import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import api, { API_URL } from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState(0);
    const [wishlist, setWishlist] = useState([]);
    const { user } = useContext(AuthContext);
    const { showNotification } = useNotification();
    const navigate = useNavigate();

    const fetchWishlist = async () => {
        if (!user) return;
        try {
            const res = await api.get('/api/wishlist');
            setWishlist(res.data.map(item => item._id || item));
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const res = await api.get(`/api/products/${id}`);
                setProduct(res.data);
                await fetchWishlist();
            } catch (error) {
                console.error('Error', error);
            }
        };
        fetchProductData();
    }, [id, user]);

    const toggleWishlist = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            const res = await api.post(`/api/wishlist/${product._id}`);
            showNotification(res.data.message);
            fetchWishlist();
        } catch (error) {
            showNotification('Error al actualizar favoritos', 'error');
        }
    };

    const addToCart = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            await api.post('/api/cart', { product_id: product._id, quantity: 1 });
            showNotification('Añadido al carrito con éxito');
        } catch (error) {
            showNotification('Error al añadir al carrito', 'error');
        }
    };

    if (!product) return <div className="text-center mt-4"><h3>Cargando pieza...</h3></div>;

    return (
        <div className="container" style={{ marginTop: '60px', marginBottom: '60px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>

                {/* LADO IZQUIERDO: GALERÍA DE IMÁGENES */}
                <div>
                    <div style={{
                        width: '100%',
                        height: '500px',
                        backgroundColor: '#fafafa',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#bbb',
                        border: '1px solid var(--color-border)',
                        marginBottom: '20px',
                        overflow: 'hidden'
                    }}>
                        {product.images && product.images.length > 0 ? (
                            <img
                                src={product.images[mainImage].startsWith('http') ? product.images[mainImage] : `${API_URL}/${product.images[mainImage]}`}
                                alt={product.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <span>Sin Imagen</span>
                        )}
                    </div>

                    {/* Miniaturas */}
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        {product.images && product.images.map((img, index) => (
                            <div
                                key={index}
                                onClick={() => setMainImage(index)}
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    backgroundColor: '#fafafa',
                                    border: mainImage === index ? '2px solid var(--color-text)' : '1px solid var(--color-border)',
                                    cursor: 'pointer',
                                    overflow: 'hidden'
                                }}
                            >
                                <img
                                    src={img.startsWith('http') ? img : `${API_URL}/${img}`}
                                    alt={`Miniatura ${index}`}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* LADO DERECHO: INFORMACIÓN DEL PRODUCTO */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <span style={{ textTransform: 'uppercase', fontSize: '0.8rem', color: 'var(--color-text-light)', letterSpacing: '0.1em' }}>
                        {product.category}
                    </span>
                    <h1 style={{ fontSize: '2.5rem', margin: '15px 0' }}>{product.name}</h1>

                    <div style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
                        $ {product.price.toLocaleString('es-CO')} COP
                    </div>

                    <div style={{ padding: '20px 0', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', marginBottom: '30px' }}>
                        <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', marginBottom: '10px' }}>FICHA TÉCNICA</h4>
                        <p style={{ color: 'var(--color-text-light)' }}>{product.description}</p>
                    </div>

                    <div style={{ display: 'flex', gap: '20px' }}>
                        <button className="btn btn-solid" style={{ flex: 1, padding: '20px' }} onClick={addToCart}>
                            AÑADIR AL CARRITO
                        </button>
                        <button
                            onClick={toggleWishlist}
                            style={{
                                width: '60px',
                                border: '1px solid #000',
                                background: 'none',
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                color: wishlist.includes(product?._id) ? '#ff4d4d' : '#000',
                                transition: 'all 0.3s'
                            }}>
                            {wishlist.includes(product?._id) ? '♥' : '♡'}
                        </button>
                    </div>

                    {/* Información de envío */}
                    <div style={{ marginTop: '20px', fontSize: '0.8rem', color: 'var(--color-text-light)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <span>Envíos Nacionales Exprés de 0 a 4 días.</span>
                        <span>Cambios y Devoluciones sin costo.</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProductDetails;
