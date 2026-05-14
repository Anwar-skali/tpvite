import type { AxiosInstance } from 'axios';
import type { User } from './authSlice';

/** Payload du « JWT » pédagogique — un vrai JWT est signé (HMAC / RSA) par le serveur. */
export interface SimulatedJwtPayload {
  userId: number;
  email: string;
  role: 'admin';
  exp: number;
}

/**
 * Génère un faux JWT (chaîne base64) à partir d’un objet JSON.
 * Ce n’est PAS un JWT valide (pas de header.payload.signature) : uniquement pour
 * illustrer Bearer + interceptors sans backend crypto.
 */
export function createSimulatedJwt(user: User): string {
  const payload: SimulatedJwtPayload = {
    userId: user.id,
    email: user.email,
    role: 'admin',
    exp: Date.now() + 3_600_000,
  };
  return btoa(JSON.stringify(payload));
}

type UserRow = User & { password: string };

/**
 * Logique métier commune aux deux formulaires (MUI / Bootstrap).
 * Retourne user + token simulé après validation json-server.
 */
export async function loginWithEmailPassword(
  client: AxiosInstance,
  email: string,
  password: string
): Promise<{ user: User; token: string }> {
  const { data: users } = await client.get<UserRow[]>(`/users?email=${encodeURIComponent(email)}`);
  if (users.length === 0 || users[0].password !== password) {
    throw new Error('Email ou mot de passe incorrect');
  }
  const { password: _ignored, ...rest } = users[0];
  const user: User = {
    id: rest.id,
    email: rest.email,
    name: rest.name,
  };
  const token = createSimulatedJwt(user);
  return { user, token };
}
