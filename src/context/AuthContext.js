import { createContext, useContext, useState, useMemo } from 'react';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState();
    const login = () => {
        setUser({
            name: 'John Doe',
            email: 'example@example.com',
            role: 'kitchen',
        });
    };
    const logout = () => {
        setUser();
    };
    const value = useMemo(() => ({ user, login, logout }), [user]);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
