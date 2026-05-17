import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={{
            backgroundColor: '#000',
            color: '#fff',
            padding: '80px 5% 40px',
            marginTop: '100px',
            borderTop: '1px solid #333'
        }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '40px',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                {/* Branding */}
                <div>
                    <h2 style={{ fontSize: '1.5rem', letterSpacing: '0.2em', marginBottom: '20px' }}>BRIELA</h2>
                    <p style={{ fontSize: '0.8rem', color: '#888', lineHeight: '1.8' }}>
                        Joyas exclusivas diseñadas para capturar la esencia de la elegancia y el minimalismo. Cada pieza cuenta una historia.
                    </p>
                </div>

                {/* Enlaces Rápidos */}
                <div>
                    <h4 style={{ fontSize: '0.9rem', letterSpacing: '0.1em', marginBottom: '20px', color: '#fff' }}>MENÚ</h4>
                    <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.8rem', color: '#888' }}>
                        <li style={{ marginBottom: '10px' }}><Link to="/">Colección</Link></li>
                        <li style={{ marginBottom: '10px' }}><Link to="/cart">Carrito</Link></li>
                        <li style={{ marginBottom: '10px' }}><Link to="/login">Cuenta</Link></li>
                    </ul>
                </div>

                {/* Redes Sociales */}
                <div>
                    <h4 style={{ fontSize: '0.9rem', letterSpacing: '0.1em', marginBottom: '20px', color: '#fff' }}>SÍGUENOS</h4>
                    <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.8rem', color: '#888' }}>
                        <li style={{ marginBottom: '10px' }}><a href="#" target="_blank">Instagram</a></li>
                        <li style={{ marginBottom: '10px' }}><a href="#" target="_blank">Pinterest</a></li>
                    </ul>
                </div>

                {/* Contacto */}
                <div>
                    <h4 style={{ fontSize: '0.9rem', letterSpacing: '0.1em', marginBottom: '20px', color: '#fff' }}>CONTACTO</h4>
                    <p style={{ fontSize: '0.8rem', color: '#888' }}>
                        Bogotá, Colombia<br />
                        contacto@briela.com
                    </p>
                </div>
            </div>

            <div style={{
                marginTop: '60px',
                paddingTop: '20px',
                borderTop: '1px solid #1a1a1a',
                textAlign: 'center',
                fontSize: '0.7rem',
                color: '#444',
                letterSpacing: '0.1em'
            }}>
                © 2026 BRIELA JOYERÍA EXCLUSIVA. TODOS LOS DERECHOS RESERVADOS.
            </div>
        </footer>
    );
};

export default Footer;
