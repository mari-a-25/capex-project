import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAirtableData } from '../services/useAirtableData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { loginParticipant, getParticipant } = useAirtableData();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const login = async (identifier, password) => {
        setLoading(true);
        setError(null);
        try {
            const record = await loginParticipant(identifier, password);
            if (record && record.id) {
                const acceso = record.fields['Acceso_Portal'];

                if (acceso === 'Denegado') {
                    setError('Tu acceso al portal ha sido denegado por el administrador.');
                    return false;
                }

                if (acceso === 'Pendiente') {
                    setError('Tu registro está en revisión. Te avisaremos cuando tu cuenta sea activada.');
                    return false;
                }

                if (acceso !== 'Permitido' && acceso !== undefined) {
                    setError('Acceso denegado. Contacte a soporte de CAPEX.');
                    return false;
                }

                const userData = { recordId: record.id, ...record.fields };
                setUser(userData);
                localStorage.setItem('capex_user_record_id', record.id);
                return true;
            } else {
                setError('ID/Correo o contraseña incorrectos.');
                return false;
            }
        } catch (err) {
            setError('Error al conectar con el servidor. Intente más tarde.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('capex_user_record_id');
    };

    useEffect(() => {
        const savedId = localStorage.getItem('capex_user_record_id');
        if (savedId) {
            const autoLogin = async () => {
                try {
                    const data = await getParticipant(savedId);
                    setUser({ recordId: data.id, ...data.fields });
                } catch (e) {
                    localStorage.removeItem('capex_user_record_id');
                } finally {
                    setLoading(false);
                }
            };
            autoLogin();
        } else {
            setLoading(false);
        }
    }, [getParticipant]);

    return (
        <AuthContext.Provider value={{ user, loading, error, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
