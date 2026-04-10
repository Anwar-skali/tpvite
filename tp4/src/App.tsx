import React, { useState } from 'react';
import { AuthProvider, useAuth } from './features/auth/AuthContext';
import LoginMUI from './features/auth/LoginMUI';
import LoginBS from './features/auth/LoginBS';
import Dashboard from './pages/Dashboard';

function AuthGuard() {
  const { state } = useAuth();
  const [loginType, setLoginType] = useState<'MUI' | 'BS'>('MUI');

  // Si l'utilisateur n'est pas connecté, afficher le formulaire de Login.
  if (!state.user) {
    return (
      <div style={{ position: 'relative' }}>
        <button 
          onClick={() => setLoginType(loginType === 'MUI' ? 'BS' : 'MUI')}
          style={{ 
            position: 'absolute', top: 15, right: 15, zIndex: 1000, 
            padding: '8px 16px', cursor: 'pointer', borderRadius: '4px',
            backgroundColor: '#000', color: '#fff', border: 'none'
          }}
        >
          ➔ Basculer vers le Login {loginType === 'MUI' ? 'Bootstrap' : 'MUI'}
        </button>

        {/* Rendu conditionnel des deux implémentations */}
        {loginType === 'MUI' ? <LoginMUI /> : <LoginBS />}
      </div>
    );
  }

  // S'il est connecté, afficher le Dashboard.
  return <Dashboard />;
}

export default function App() {
  return (
    <AuthProvider>
      <AuthGuard />
    </AuthProvider>
  );
}
