import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { setAuthToken } from '../api/axios';

/**
 * Pont Redux → Axios : à chaque changement de token en mémoire (store),
 * on met à jour le header par défaut. Pas de localStorage : en cas de XSS,
 * un attaquant ne peut pas lire le token via `localStorage.getItem` (il reste
 * toutefois exposé au JS de la page — d’où l’intérêt du CSP, sanitization, etc.).
 */
export default function AuthTokenSync() {
  const token = useSelector((s: RootState) => s.auth.token);

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  return null;
}
