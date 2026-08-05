
/**
 * Lightweight token store that prefers browser storage when available and
 * falls back to an in-memory variable on the server. This avoids leaking
 * tokens in uncontrolled module-level state when running multiple processes.
 */
let inMemoryToken: string | null = null;

const isBrowser = typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';

export const setAccessToken = (token: string) => {
  if (isBrowser) {
    try {
      sessionStorage.setItem('nfin_access_token', token);
      return;
    } catch {
      // ignore storage errors and fallback to memory
    }
  }
  inMemoryToken = token;
};

export const getAccessToken = () => {
  if (isBrowser) {
    try {
      return sessionStorage.getItem('nfin_access_token');
    } catch {
      return inMemoryToken;
    }
  }
  return inMemoryToken;
};

export const clearAccessToken = () => {
  if (isBrowser) {
    try {
      sessionStorage.removeItem('nfin_access_token');
    } catch {
      inMemoryToken = null;
    }
    return;
  }
  inMemoryToken = null;
};