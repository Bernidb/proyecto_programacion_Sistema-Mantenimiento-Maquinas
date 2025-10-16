import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from './LoginForm';
import { useAuthContext } from '../hooks/AuthContext';

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  const handleLogin = async (username: string, password: string): Promise<boolean> => {
    console.log('Intento login:', username, password);
    const success = await login(username, password);
    console.log('Login success:', success);
    // No navegues aquí, el routing lo hace el useEffect
    return success;
  };

  useEffect(() => {
    if (isAuthenticated) {
      console.log('Navegando a dashboard...');
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return <LoginForm onLogin={handleLogin} />;
};
