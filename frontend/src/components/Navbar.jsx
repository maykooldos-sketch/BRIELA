import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        navigate('/');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/?search=${searchTerm}`);
        if (window.innerWidth <= 768) setIsMenuOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <button
                    className="mobile-toggle"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Menu"
                >
                    {isMenuOpen ? '✕' : '☰'}
                </button>

                <Link to="/" className="logo" onClick={() => setIsMenuOpen(false)}>BRIELA</Link>

                <div className="navbar-right">
                    {user && (
                        <Link to="/cart" className="mobile-cart-icon" onClick={() => setIsMenuOpen(false)}>
                            🛒
                        </Link>
                    )}
                </div>
            </div>

            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    placeholder="BUSCAR JOYAS..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </form>

            <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
                <div className="mobile-menu-header">MENU</div>
                <Link to="/" onClick={() => setIsMenuOpen(false)}>Colección</Link>

                {user ? (
                    <>
                        <Link to="/favoritos" onClick={() => setIsMenuOpen(false)}>Mis Favoritos</Link>
                        <Link to="/cart" onClick={() => setIsMenuOpen(false)}>Carrito</Link>
                        <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Mis Pedidos</Link>
                        {user.role === 'admin' && <Link to="/admin" className="admin-link" onClick={() => setIsMenuOpen(false)}>Control Panel</Link>}
                        <button className="logout-btn" onClick={handleLogout}>Cerrar Sesión</button>
                    </>
                ) : (
                    <Link to="/login" className="login-btn-mobile" onClick={() => setIsMenuOpen(false)}>Iniciar Sesión</Link>
                )}
            </div>

            {/* WhatsApp Floating Button */}
            <a
                href="https://wa.me/573000000000"
                target="_blank"
                rel="noreferrer"
                className="whatsapp-float"
            >
                <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
            </a>
        </nav>

    );
};

export default Navbar;
