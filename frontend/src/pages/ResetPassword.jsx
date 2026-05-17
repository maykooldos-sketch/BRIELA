import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useNotification } from '../context/NotificationContext';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirm) {
            showNotification('Las contraseñas no coinciden', 'error');
            return;
        }
        try {
            await axios.post(`http://localhost:3001/api/auth/reset-password/${token}`, { password });
            showNotification('Contraseña actualizada. Ya puedes iniciar sesión.');
            navigate('/login');
        } catch (error) {
            showNotification(error.response?.data?.error || 'Error al restablecer contraseña', 'error');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
            <div style={{ maxWidth: '400px', width: '90%', padding: '40px', border: '1px solid var(--color-border)', backgroundColor: '#fff' }}>
                <h2 className="text-center mb-4">NUEVA CONTRASEÑA</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Nueva Contraseña</label>
                        <input type="password" required value={password} onChange={e => setPassword(e.target.value)} minLength={6} />
                    </div>
                    <div className="input-group">
                        <label>Confirmar Contraseña</label>
                        <input type="password" required value={confirm} onChange={e => setConfirm(e.target.value)} minLength={6} />
                    </div>
                    <button type="submit" className="btn btn-solid">CAMBIAR CONTRASEÑA</button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
