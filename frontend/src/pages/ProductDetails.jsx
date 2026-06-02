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
        <div className="container" style={{ marginTop: '40px', marginBottom: '60px' }}>
            <div className="product-detail-grid">

                {/* LADO IZQUIERDO: GALERÍA DE IMÁGENES */}
                <div>
                    <div className="product-main-image" style={{
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
                <div className="product-info-container">
                    <span className="product-category-tag">
                        {product.category}
                    </span>
                    <h1 className="product-title">{product.name}</h1>

                    <div className="product-price">
                        $ {product.price.toLocaleString('es-CO')} COP
                    </div>

                    <div className="product-description-container">
                        <h4 className="tech-specs-title">FICHA TÉCNICA</h4>
                        <p className="product-description-text">{product.description}</p>
                    </div>

                    <div className="product-actions">
                        <button className="btn btn-solid add-to-cart-btn" onClick={addToCart}>
                            AÑADIR AL CARRITO
                        </button>
                        <button
                            className={`wishlist-btn-detail ${wishlist.includes(product?._id) ? 'active' : ''}`}
                            onClick={toggleWishlist}
                        >
                            {wishlist.includes(product?._id) ? '♥' : '♡'}
                        </button>
                    </div>

                    {/* Información de envío */}
                    <div className="shipping-info">
                        <span>• Envíos Nacionales Exprés de 0 a 4 días.</span>
                        <span>• Cambios y Devoluciones sin costo.</span>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default ProductDetails;
