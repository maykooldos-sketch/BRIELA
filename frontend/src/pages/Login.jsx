import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const { showNotification } = useNotification();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (error) {
            showNotification(error.response?.data?.error || 'Error en la autenticación', 'error');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="container" style={{ maxWidth: '400px', width: '90%', padding: '40px', border: '1px solid var(--color-border)', backgroundColor: '#fff' }}>


                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Correo Electrónico</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label>Contraseña</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>

                    <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                        <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: '#666', textDecoration: 'underline' }}>¿Olvidaste tu contraseña?</Link>
                    </div>

                    <button type="submit" className="btn btn-solid">INICIAR SESIÓN</button>
                </form>

                <div className="text-center" style={{ marginTop: '30px' }}>
                    <span style={{ fontSize: '0.85rem', color: '#666' }}>¿No tienes cuenta? </span>
                    <Link to="/register" style={{ fontSize: '0.85rem', fontWeight: '600', textDecoration: 'underline' }}>Regístrate</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
