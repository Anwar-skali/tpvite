import type { ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store';

/**
 * @deprecated Le state d’auth vit désormais dans Redux (`authSlice`).
 * `AuthProvider` est un no-op conservé pour ne pas casser d’éventuels imports existants
 * pendant une migration progressive.
 *
 * Ancienne implémentation (useReducer) — conservée en commentaire pédagogique :
 *
 * function authReducer(state: AuthState, action: AuthAction): AuthState {
 *   switch (action.type) {
 *     case 'LOGIN_START': return { ...state, loading: true, error: null };
 *     case 'LOGIN_SUCCESS': return { ...state, loading: false, user: action.payload };
 *     ...
 *   }
 * }
 *
 * RTK apporte createSlice, Immer, et une structure scalable (plusieurs features).
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export type { AuthState, User } from './authSlice';

export function useAuth() {
  const state = useSelector((s: RootState) => s.auth);
  const dispatch = useDispatch<AppDispatch>();
  return { state, dispatch };
}
