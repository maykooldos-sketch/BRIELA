import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import api, { API_URL } from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import { useModal } from '../context/ModalContext';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const { showNotification } = useNotification();
    const { showConfirm } = useModal();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [tab, setTab] = useState('products'); // Empezamos en productos para que lo vea enseguida

    // Formularios
    const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', category: 'pulseras', stock: 1, images: [] });
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({ name: '', description: '', price: '', category: 'pulseras', stock: '', images: [] });

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }
        fetchData();
    }, [user]);

    const fetchData = async () => {
        try {
            const ordersRes = await api.get('/api/orders/all');
            const productsRes = await api.get('/api/products');
            setOrders(ordersRes.data);
            setProducts(productsRes.data);
        } catch (e) {
            console.error(e);
        }
    };

    const updateOrderStatus = async (id, status) => {
        try {
            await api.put(`/api/orders/${id}/status`, { status });
            fetchData();
            showNotification('Estado actualizado');
        } catch (e) {
            showNotification('Error actualizando pedido', 'error');
        }
    };

    const updateTracking = async (id, carrier, trackingId) => {
        try {
            await api.put(`/api/orders/${id}/status`, { carrier, trackingId });
            fetchData();
            showNotification('Información de envío guardada');
        } catch (e) {
            showNotification('Error guardando guía', 'error');
        }
    };

    const deleteOrder = (id) => {
        showConfirm(
            'Eliminar Pedido',
            '¿Deseas eliminar este pedido permanentemente del registro?',
            async () => {
                try {
                    await api.delete(`/api/orders/${id}`);
                    fetchData();
                    showNotification('Pedido eliminado');
                } catch (e) {
                    showNotification('Error al eliminar pedido', 'error');
                }
            }
        );
    };

    const createProduct = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', newProduct.name);
            formData.append('description', newProduct.description);
            // Limpiar puntos si el usuario los escribió (ej: 180.000 -> 180000)
            const cleanPrice = String(newProduct.price).replace(/\./g, '');
            const cleanStock = String(newProduct.stock).replace(/\./g, '');
            formData.append('price', Number(cleanPrice));
            formData.append('category', newProduct.category);
            formData.append('stock', Number(cleanStock));

            if (newProduct.images && newProduct.images.length > 0) {
                Array.from(newProduct.images).forEach(image => {
                    formData.append('images', image);
                });
            }

            await api.post('/api/products', formData);

            setNewProduct({ name: '', description: '', price: '', category: 'pulseras', stock: 1, images: [] });
            fetchData();
            showNotification('¡Producto creado con éxito!');
        } catch (e) {
            console.error('Error al crear producto:', e.response?.data || e.message);
            showNotification('Error creando producto. Revisa la consola.', 'error');
        }
    };

    const deleteProduct = (id) => {
        showConfirm(
            'Eliminar Joya',
            '¿Seguro quieres eliminar esta joya permanentemente del catálogo?',
            async () => {
                try {
                    await api.delete(`/api/products/${id}`);
                    fetchData();
                    showNotification('Producto eliminado');
                } catch (e) {
                    showNotification('Error eliminando producto', 'error');
                }
            }
        );
    };

    const saveEdit = async (id) => {
        try {
            const formData = new FormData();
            formData.append('name', editData.name);
            formData.append('description', editData.description);
            // Limpiar puntos si el usuario los escribió
            const cleanPrice = String(editData.price).replace(/\./g, '');
            const cleanStock = String(editData.stock).replace(/\./g, '');
            formData.append('price', Number(cleanPrice));
            formData.append('category', editData.category);
            formData.append('stock', Number(cleanStock));

            if (editData.images && editData.images.length > 0) {
                Array.from(editData.images).forEach(image => {
                    formData.append('images', image);
                });
            }

            await api.put(`/api/products/${id}`, formData);
            setEditingId(null);
            fetchData();
            showNotification('¡Producto actualizado!');
        } catch (e) {
            console.error('Error al actualizar producto:', e.response?.data || e.message);
            showNotification('Error al actualizar el producto', 'error');
        }
    };

    const startEditing = (p) => {
        setEditingId(p._id);
        setEditData({ name: p.name, description: p.description, price: p.price, category: p.category, stock: p.stock, images: [] });
    };

    if (!user || user.role !== 'admin') return null;

    return (
        <div className="container mt-4" style={{ maxWidth: '1200px', marginBottom: '80px' }}>
            <h2 className="mb-4 text-center">PANEL DE CONTROL GENERAL</h2>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '40px', justifyContent: 'center' }}>
                <button className={`btn ${tab === 'products' ? 'btn-solid' : ''}`} onClick={() => setTab('products')} style={{ width: 'auto' }}>GESTIÓN DE INVENTARIO</button>
                <button className={`btn ${tab === 'orders' ? 'btn-solid' : ''}`} onClick={() => setTab('orders')} style={{ width: 'auto' }}>GESTOR DE PEDIDOS</button>
            </div>

            {tab === 'products' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '40px' }}>
                    {/* FORMULARIO DE CREACIÓN */}
                    <div style={{ padding: '20px', border: '1px solid var(--color-border)', backgroundColor: '#fafafa' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>AÑADIR JOYA</h3>
                        <form onSubmit={createProduct}>
                            <div className="input-group">
                                <label>Nombre de la Pieza</label>
                                <input type="text" required value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                            </div>
                            <div className="input-group">
                                <label>Descripción / Ficha Técnica</label>
                                <textarea
                                    required
                                    value={newProduct.description}
                                    onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                                    style={{ width: '100%', padding: '10px', minHeight: '80px', fontFamily: 'var(--font-sans)', border: '1px solid var(--color-border)' }}
                                />
                            </div>
                            <div className="input-group">
                                <label>Categoría</label>
                                <select
                                    value={newProduct.category}
                                    onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                                    style={{ width: '100%', padding: '10px', border: '1px solid var(--color-border)', backgroundColor: 'transparent' }}
                                >
                                    <option value="pulseras">Pulseras</option>
                                    <option value="anillos">Anillos</option>
                                    <option value="collares">Collares</option>
                                    <option value="aretes">Aretes</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div className="input-group" style={{ flex: 1 }}>
                                    <label>Precio (COP)</label>
                                    <input type="number" required value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
                                </div>
                                <div className="input-group" style={{ flex: 1 }}>
                                    <label>Stock Disp.</label>
                                    <input type="number" required value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Imágenes del Producto (Puedes seleccionar varias)</label>
                                <input type="file" accept="image/*" multiple onChange={e => setNewProduct({ ...newProduct, images: e.target.files })} />
                            </div>
                            <button className="btn btn-solid" style={{ padding: '15px' }} type="submit">Guardar en Base de Datos</button>
                        </form>
                    </div>

                    {/* VISTA GENERAL DEL CATÁLOGO */}
                    <div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>CATÁLOGO PUBLICADO</h3>
                        <div style={{ borderTop: '2px solid var(--color-text)' }}>
                            {products.length === 0 ? <p style={{ padding: '20px 0' }}>El inventario está vacío.</p> : null}

                            {products.map(p => (
                                <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0', borderBottom: '1px solid var(--color-border)' }}>

                                    <div style={{ marginRight: '15px', width: '80px', height: '80px', flexShrink: 0, backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {p.images && p.images.length > 0 ? (
                                            <img src={p.images[0].startsWith('http') ? p.images[0] : `${API_URL}/${p.images[0]}`} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <span style={{ fontSize: '0.6rem', color: '#999' }}>Sin Fotos</span>
                                        )}
                                    </div>

                                    <div style={{ flex: 2, paddingRight: '20px' }}>
                                        <span style={{ textTransform: 'uppercase', fontSize: '0.7rem', color: '#888', letterSpacing: '0.1em' }}>{p.category}</span>
                                        <h4 style={{ margin: '5px 0', fontFamily: 'var(--font-sans)', letterSpacing: 0 }}>{p.name}</h4>
                                        <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '5px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.description}</p>
                                    </div>

                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end', justifyContent: 'center' }}>
                                        {editingId === p._id ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '15px', backgroundColor: '#f9f9f9', border: '1px solid #ccc', width: '300px' }}>
                                                <input type="text" placeholder="Nombre" value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} style={{ padding: '5px' }} />
                                                <textarea placeholder="Descripción" value={editData.description} onChange={e => setEditData({ ...editData, description: e.target.value })} style={{ padding: '5px' }} />
                                                <select value={editData.category} onChange={e => setEditData({ ...editData, category: e.target.value })} style={{ padding: '5px' }}>
                                                    <option value="pulseras">Pulseras</option>
                                                    <option value="anillos">Anillos</option>
                                                    <option value="collares">Collares</option>
                                                    <option value="aretes">Aretes</option>
                                                </select>
                                                <div style={{ display: 'flex', gap: '5px' }}>
                                                    <div style={{ flex: 1 }}>
                                                        <label style={{ fontSize: '0.6rem' }}>Precio:</label>
                                                        <input type="number" value={editData.price} onChange={e => setEditData({ ...editData, price: e.target.value })} style={{ width: '100%', padding: '5px' }} />
                                                    </div>
                                                    <div style={{ width: '60px' }}>
                                                        <label style={{ fontSize: '0.6rem' }}>Stock:</label>
                                                        <input type="number" value={editData.stock} onChange={e => setEditData({ ...editData, stock: e.target.value })} style={{ width: '100%', padding: '5px' }} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label style={{ fontSize: '0.6rem', fontWeight: 'bold' }}>Actualizar Galería (Múltiples archivos):</label>
                                                    <input type="file" accept="image/*" multiple onChange={e => setEditData({ ...editData, images: e.target.files })} style={{ fontSize: '0.7rem', marginTop: '5px' }} />
                                                </div>
                                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                                    <button onClick={() => saveEdit(p._id)} style={{ flex: 1, background: 'green', color: 'white', border: 'none', padding: '8px', cursor: 'pointer' }}>Guardar</button>
                                                    <button onClick={() => setEditingId(null)} style={{ flex: 1, background: 'gray', color: 'white', border: 'none', padding: '8px', cursor: 'pointer' }}>Cancelar</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontWeight: '600' }}>$ {p.price.toLocaleString('es-CO')}</div>
                                                    <div style={{ fontSize: '0.8rem', color: p.stock > 0 ? 'green' : 'red' }}>Stock: {p.stock}</div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '15px', fontSize: '0.85rem' }}>
                                                    <button onClick={() => startEditing(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Editar información</button>
                                                    <button onClick={() => deleteProduct(p._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', color: 'red' }}>Quitar</button>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {tab === 'orders' && (
                <div>
                    <h3>SEGUIMIENTO DE TODOS LOS PEDIDOS</h3>
                    <table style={{ width: '100%', marginTop: '20px', textAlign: 'left', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--color-text)' }}>
                                <th style={{ padding: '10px 0' }}>CLIENTE</th>
                                <th>FECHA</th>
                                <th>TOTAL</th>
                                <th>ESTADO ACTUAL</th>
                                <th>ACCIÓN (CAMBIAR A)</th>
                                <th>CONTROL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(o => (
                                <tr key={o._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <td style={{ padding: '15px 0' }}>{o.user?.email}</td>
                                    <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                                    <td>$ {o.total.toLocaleString()}</td>
                                    <td>
                                        <span style={{ fontWeight: '600', textTransform: 'uppercase', fontSize: '0.8rem' }}>{o.status}</span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                            <select
                                                onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                                                value={o.status}
                                                style={{ padding: '5px', outline: 'none', border: '1px solid #ccc' }}
                                            >
                                                <option value="pendiente">Pendiente</option>
                                                <option value="pagado">Pagado</option>
                                                <option value="enviado">Enviado</option>
                                                <option value="entregado">Entregado</option>
                                            </select>

                                            {/* Tracking Info Inline */}
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '5px' }}>
                                                <input
                                                    type="text"
                                                    placeholder="Transportadora"
                                                    defaultValue={o.carrier}
                                                    onBlur={(e) => updateTracking(o._id, e.target.value, o.trackingId)}
                                                    style={{ fontSize: '0.7rem', padding: '3px' }}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="N° de Guía"
                                                    defaultValue={o.trackingId}
                                                    onBlur={(e) => updateTracking(o._id, o.carrier, e.target.value)}
                                                    style={{ fontSize: '0.7rem', padding: '3px' }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <button onClick={() => deleteOrder(o._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'red', textDecoration: 'underline', fontSize: '0.8rem' }}>Borrar Pedido</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

        </div>
    );
};

export default AdminDashboard;
