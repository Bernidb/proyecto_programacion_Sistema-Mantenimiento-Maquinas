import { useState, useEffect, useCallback } from 'react';
import { User } from '../types';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        if (isMounted) {
          setIsAuthenticated(false);
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser && isMounted) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } else if (isMounted) {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error cargando usuario:', error);
        if (isMounted) {
          setUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);

      const userData: User = {
        name: username,
        role: 'Usuario',
        id: '',
        username: '',
      };
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);

      return true;
    } catch (error) {
      console.error('Error al autenticar:', error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }, []);

  return { isAuthenticated, user, login, logout, loading };
};
