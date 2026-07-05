export const LOVE_AUTH_STORAGE_KEY = 'love_access_granted';

export function hasLoveAccess() {
  return localStorage.getItem(LOVE_AUTH_STORAGE_KEY) === 'true';
}

export function grantLoveAccess() {
  localStorage.setItem(LOVE_AUTH_STORAGE_KEY, 'true');
}

export function clearLoveAccess() {
  localStorage.removeItem(LOVE_AUTH_STORAGE_KEY);
}
