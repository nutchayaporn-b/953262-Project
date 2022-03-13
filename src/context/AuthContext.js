import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import axiosHelper from '../utils/axios';
import { toast } from 'react-hot-toast';
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    name: 'Anonymous',
    role: 'guest',
  });

  useEffect(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      await axiosHelper('get', '/auth/login').then(res => {
        // console.log(res.data);
        if (res.data.success) {
          setUser(res.data.data);
        }
      });
    }
  }, []);

  const login = async (email, password) => {
    const success = await axiosHelper('post', '/auth/login', { email, password })
      .then(res => {
        if (res.data.success) {
          localStorage.setItem('token', res.data.token);
          setUser(res.data.data);
          toast.success('Welcome user: ' + res.data.data.name);
          return true;
        }
        toast.error('Login failed ' + res.data.error);
        return false;
      })
      .catch(err => {
        toast.error('Login failed');
        console.log(err);
        return false;
      });
    return success;
  };
  const logout = () => {
    toast.success('Logout success');
    localStorage.removeItem('token');
    setUser({
      name: 'Anonymous',
      role: 'guest',
    });
  };
  const value = useMemo(() => ({ user, setUser, login, logout }), [user, setUser, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
