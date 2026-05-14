import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000',
});

/**
 * Configure l’en-tête Authorization pour toutes les requêtes Axios par défaut.
 * En onglet Network, on voit `Authorization: Bearer <token>` car le navigateur
 * envoie les headers HTTP définis sur l’instance / defaults.
 *
 * @param token — JWT (ici simulé) ou `null` pour retirer le header (logout).
 */
export function setAuthToken(token: string | null): void {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export default api;
