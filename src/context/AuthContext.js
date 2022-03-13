import { createContext, useContext, useState, useMemo } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    name: 'Anonymous',
    role: 'guest',
  });
  const login = () => {
    setUser({
      name: 'John Doe',
      role: 'kitchen',
    });
  };
  const logout = () => {
    setUser();
  };
  const value = useMemo(() => ({ user, login, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
