import { createContext, useState, useContext } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            {notification && (
                <div style={{
                    position: 'fixed',
                    bottom: '30px',
                    right: '30px',
                    backgroundColor: notification.type === 'success' ? '#000' : '#800',
                    color: '#fff',
                    padding: '15px 30px',
                    borderRadius: '0',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                    zIndex: 9999,
                    animation: 'slideIn 0.4s ease-out',
                    border: '1px solid #fff',
                    letterSpacing: '0.1em',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase'
                }}>
                    {notification.message}
                    <style>{`
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`}</style>
                </div>
            )}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
