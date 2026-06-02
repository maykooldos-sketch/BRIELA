import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import api, { API_URL } from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('todos');
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('search');

    const fetchWishlist = async () => {
        if (!user) return;
        try {
            const res = await api.get('/api/wishlist');
            setWishlist(res.data.map(item => item._id || item)); // Guardamos solo IDs
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await api.get('/api/products');
                setProducts(res.data);
                setFilteredProducts(res.data);
                await fetchWishlist();
            } catch (error) {
                console.error('Error fetching products', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    useEffect(() => {
        let result = products;

        if (query) {
            result = result.filter(p =>
                p.name.toLowerCase().includes(query.toLowerCase()) ||
                p.category.toLowerCase().includes(query.toLowerCase())
            );
        }

        if (selectedCategory !== 'todos') {
            result = result.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
        }

        setFilteredProducts(result);
    }, [query, selectedCategory, products]);

    const toggleWishlist = async (productId, e) => {
        if (e) e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            const res = await api.post(`/api/wishlist/${productId}`);
            showNotification(res.data.message);
            fetchWishlist();
        } catch (error) {
            showNotification('Error al actualizar favoritos', 'error');
        }
    };

    const addToCart = async (productId, e) => {
        if (e) e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            await api.post('/api/cart', { product_id: productId, quantity: 1 });
            showNotification('Añadido al carrito con éxito');
        } catch (error) {
            showNotification('Error al añadir al carrito', 'error');
        }
    };

    const categories = ['todos', 'pulseras', 'anillos', 'collares', 'aretes'];

    return (
        <div className="container mt-4">
            <h1 className="text-center" style={{ letterSpacing: '0.15em' }}>
                EXCLUSIVA DE BRIELA
            </h1>


            {/* Filtros de Categoría */}
            <div className="category-filters-container">


                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        style={{
                            background: selectedCategory === cat ? '#000' : 'none',
                            color: selectedCategory === cat ? '#fff' : '#000',
                            border: '1px solid #000',
                            padding: '8px 20px',
                            fontSize: '0.7rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="product-grid">

                {loading ? (
                    Array(6).fill(0).map((_, i) => (
                        <div key={i} style={{ textAlign: 'center' }}>
                            <div className="skeleton" style={{ width: '100%', height: '350px', border: '1px solid var(--color-border)' }}></div>
                            <div style={{ padding: '15px 0' }}>
                                <div className="skeleton" style={{ width: '40%', height: '10px', margin: '0 auto 10px' }}></div>
                                <div className="skeleton" style={{ width: '70%', height: '20px', margin: '0 auto 10px' }}></div>
                                <div className="skeleton" style={{ width: '30%', height: '15px', margin: '0 auto' }}></div>
                            </div>
                        </div>
                    ))
                ) : (
                    filteredProducts.map(product => (
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

                            {/* Wishlist Heart Icon */}
                            <button
                                onClick={(e) => toggleWishlist(product._id, e)}
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
                                    color: wishlist.includes(product._id) ? '#ff4d4d' : '#000',
                                    transition: 'color 0.3s'
                                }}
                            >
                                {wishlist.includes(product._id) ? '♥' : '♡'}
                            </button>

                            <button className="btn btn-outline" style={{ marginTop: '10px' }} onClick={(e) => addToCart(product._id, e)}>AÑADIR AL CARRITO</button>
                        </div>
                    ))
                )}
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center" style={{ padding: '50px 0', color: 'var(--color-text-light)' }}>
                    No se encontraron joyas que coincidan con tu búsqueda.
                </div>
            )}
        </div>
    );
};

export default Home;
