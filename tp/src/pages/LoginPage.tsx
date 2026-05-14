import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import LoginMUI from '../features/auth/LoginMUI';
import LoginBS from '../features/auth/LoginBS';

/**
 * Page de connexion : conserve les deux variantes UI (MUI / Bootstrap) du TP4 initial.
 */
export default function LoginPage() {
  const user = useSelector((s: RootState) => s.auth.user);
  const [loginType, setLoginType] = useState<'MUI' | 'BS'>('MUI');

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setLoginType(loginType === 'MUI' ? 'BS' : 'MUI')}
        style={{
          position: 'absolute',
          top: 15,
          right: 15,
          zIndex: 1000,
          padding: '8px 16px',
          cursor: 'pointer',
          borderRadius: '4px',
          backgroundColor: '#000',
          color: '#fff',
          border: 'none',
        }}
      >
        ➔ Basculer vers le Login {loginType === 'MUI' ? 'Bootstrap' : 'MUI'}
      </button>

      {loginType === 'MUI' ? <LoginMUI /> : <LoginBS />}
    </div>
  );
}
