import { useState } from 'react';
import axios from 'axios';
import { useNotification } from '../context/NotificationContext';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const { showNotification } = useNotification();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/api/auth/forgot-password', { email });
            setSent(true);
            showNotification('Correo enviado con éxito');
        } catch (error) {
            showNotification(error.response?.data?.error || 'Error al procesar solicitud', 'error');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
            <div style={{ maxWidth: '400px', width: '90%', padding: '40px', border: '1px solid var(--color-border)', backgroundColor: '#fff' }}>
                <h2 className="text-center mb-4">RECUPERAR CLAVE</h2>

                {sent ? (
                    <div className="text-center">
                        <p style={{ marginBottom: '30px', color: '#666' }}>Hemos enviado un enlace a <strong>{email}</strong>. Revisa tu bandeja de entrada (y spam).</p>
                        <Link to="/login" className="btn btn-solid">VOLVER AL LOGIN</Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '20px', textAlign: 'center' }}>Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.</p>
                        <div className="input-group">
                            <label>Correo Electrónico</label>
                            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-solid">ENVIAR ENLACE</button>
                        <div className="text-center" style={{ marginTop: '20px' }}>
                            <Link to="/login" style={{ fontSize: '0.8rem', textDecoration: 'underline' }}>Cancelar</Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
