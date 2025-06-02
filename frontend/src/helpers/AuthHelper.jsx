import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const res = await axios.get('/api/auth/status', { withCredentials: true });
      console.log('Auth response:', res.data);
      setIsLoggedIn(res.data.isLoggedIn);
      if (res.data.isLoggedIn) {
        setUser({
          id: res.data.id,
          userName: res.data.userName,
          email: res.data.email,
          roles: res.data.roles,
          accountVerified: res.data.accountVerified
        });
      } else {
        setUser(null);
      }
    } catch (err) {
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    console.log('Auth status:', isLoggedIn);
    console.log("user object from useAuth:", user);

  }, [isLoggedIn, user]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser, checkAuthStatus, isLoading }}>
      {children}
    </AuthContext.Provider>

  );
};

export const useAuth = () => useContext(AuthContext);
