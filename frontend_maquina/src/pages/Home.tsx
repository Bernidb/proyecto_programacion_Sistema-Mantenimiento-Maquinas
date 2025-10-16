import React, { useState } from 'react';
import { LoginForm } from '../components/LoginForm';

async function doLogin(username: string, password: string): Promise<boolean> {
  const res = await fetch('http://127.0.0.1:8000/api/token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (res.ok) {
    const data = await res.json();
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    return true;
  }
  return false;
}

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));

  return (
    <>
      {!isAuthenticated ? (
        <LoginForm
          onLogin={async (user, pass) => {
            const success = await doLogin(user, pass);
            if (success) setIsAuthenticated(true);
            return success;
          }}
        />
      ) : (
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-4">Bienvenido al sistema</h1>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => {
              localStorage.clear();
              setIsAuthenticated(false);
            }}
          >
            Cerrar sesión
          </button>
          {/* Acá podés agregar el dashboard, lista de máquinas, etc */}
        </div>
      )}
    </>
  );
}
