import { createContext, useState, useContext } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null
    });

    const showConfirm = (title, message, onConfirm) => {
        setModalConfig({
            isOpen: true,
            title,
            message,
            onConfirm: () => {
                onConfirm();
                closeModal();
            }
        });
    };

    const closeModal = () => {
        setModalConfig({ ...modalConfig, isOpen: false });
    };

    return (
        <ModalContext.Provider value={{ showConfirm }}>
            {children}
            {modalConfig.isOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2000,
                    backdropFilter: 'blur(5px)'
                }}>
                    <div className="modal-content" style={{
                        backgroundColor: '#fff',
                        padding: '40px',
                        maxWidth: '400px',
                        width: '90%',
                        textAlign: 'center',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                        border: '1px solid #000'
                    }}>
                        <h3 style={{ textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '20px', fontSize: '1.2rem' }}>{modalConfig.title}</h3>
                        <p style={{ color: '#666', marginBottom: '30px', lineHeight: '1.6' }}>{modalConfig.message}</p>

                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                            <button
                                onClick={closeModal}
                                style={{
                                    backgroundColor: 'transparent',
                                    border: '1px solid #ccc',
                                    padding: '12px 25px',
                                    cursor: 'pointer',
                                    textTransform: 'uppercase',
                                    fontSize: '0.7rem',
                                    letterSpacing: '0.1em'
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={modalConfig.onConfirm}
                                style={{
                                    backgroundColor: '#000',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '12px 25px',
                                    cursor: 'pointer',
                                    textTransform: 'uppercase',
                                    fontSize: '0.7rem',
                                    letterSpacing: '0.1em'
                                }}
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ModalContext.Provider>
    );
};

export const useModal = () => useContext(ModalContext);
