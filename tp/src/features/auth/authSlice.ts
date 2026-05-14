import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/**
 * Utilisateur authentifié (sans mot de passe — jamais stocké dans le state global).
 * Redux Toolkit + Immer : on peut « muter » l’état dans les reducers ; Immer produit
 * une mise à jour immuable pour React.
 */
export interface User {
  id: number;
  email: string;
  name?: string;
}

export interface AuthState {
  user: User | null;
  /** JWT simulé (voir Login) — un vrai JWT doit être émis et vérifié côté serveur. */
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<{ user: User; token: string }>) {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
