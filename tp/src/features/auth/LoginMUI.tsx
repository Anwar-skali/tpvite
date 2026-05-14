import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, TextField, Button, Typography, Alert } from '@mui/material';
import { useAuth } from './AuthContext';
import { loginStart, loginSuccess, loginFailure } from './authSlice';
import { loginWithEmailPassword } from './Login';
import api from '../../api/axios';

export default function LoginMUI() {
  const { state, dispatch } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const { user, token } = await loginWithEmailPassword(api, email, password);
      /**
       * JWT simulé : encodage base64 d’un JSON — aucune signature serveur.
       * En production : le serveur émet un JWT signé après vérification des identifiants ;
       * le client ne fabrique jamais le secret / la signature.
       */
      dispatch(loginSuccess({ user, token }));
      navigate(from, { replace: true });
    } catch (err) {
      if (err instanceof Error && err.message === 'Email ou mot de passe incorrect') {
        dispatch(loginFailure(err.message));
      } else {
        dispatch(loginFailure('Erreur serveur'));
      }
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#f0f0f0' }}>
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 4 }}>
          <Typography variant="h4" align="center" color="#1B8C3E" fontWeight={700}>
            TaskFlow
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary">
            Connectez-vous pour continuer
          </Typography>

          {state.error && <Alert severity="error">{state.error}</Alert>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={state.loading}
              sx={{ bgcolor: '#1B8C3E', '&:hover': { bgcolor: '#157a33' } }}
            >
              {state.loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
