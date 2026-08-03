const ACCESS_TOKEN_KEY = 'zentik.accessToken';
const TWO_FACTOR_TOKEN_KEY = 'zentik.twoFactorToken';

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  // Mejora futura: mover la sesion a cookies httpOnly cuando el backend lo soporte.
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearAccessToken(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function getTwoFactorToken(): string | null {
  return sessionStorage.getItem(TWO_FACTOR_TOKEN_KEY);
}

export function setTwoFactorToken(token: string): void {
  sessionStorage.setItem(TWO_FACTOR_TOKEN_KEY, token);
}

export function clearTwoFactorToken(): void {
  sessionStorage.removeItem(TWO_FACTOR_TOKEN_KEY);
}
