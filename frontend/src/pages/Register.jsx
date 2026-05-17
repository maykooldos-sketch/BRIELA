import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:3001/api/auth/register', { name, email, password });
            login(res.data.user, res.data.token);
            showNotification('¡Cuenta creada con éxito!');
            navigate('/');
        } catch (error) {
            showNotification(error.response?.data?.error || 'Error al registrarse', 'error');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div style={{ maxWidth: '400px', width: '90%', padding: '40px', border: '1px solid var(--color-border)', backgroundColor: '#fff' }}>
                <h2 className="text-center mb-4">CREAR CUENTA</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Nombre Completo</label>
                        <input type="text" required value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label>Correo Electrónico</label>
                        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label>Contraseña</label>
                        <input type="password" required value={password} onChange={e => setPassword(e.target.value)} minLength={6} />
                    </div>
                    <button type="submit" className="btn btn-solid">REGISTRARSE</button>
                </form>
                <div className="text-center" style={{ marginTop: '20px' }}>
                    <span style={{ fontSize: '0.85rem', color: '#666' }}>¿Ya tienes cuenta? </span>
                    <Link to="/login" style={{ fontSize: '0.85rem', fontWeight: '600', textDecoration: 'underline' }}>Inicia Sesión</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
