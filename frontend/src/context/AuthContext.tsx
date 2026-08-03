import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { authApi } from '../api/authApi';
import type { AuthResponse, AuthUser, LoginPayload } from '../types/auth';
import {
  clearAccessToken,
  clearTwoFactorToken,
  getAccessToken,
  setAccessToken,
  setTwoFactorToken,
} from '../utils/tokenStorage';
import { AuthContext, type AuthContextValue } from './authContextValue';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getAccessToken());
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const completeSession = useCallback((response: AuthResponse) => {
    setAccessToken(response.accessToken);
    clearTwoFactorToken();
    setToken(response.accessToken);
    setUser(response.user);
  }, []);

  const logout = useCallback(() => {
    clearAccessToken();
    clearTwoFactorToken();
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const currentToken = getAccessToken();

    if (!currentToken) {
      logout();
      setIsLoading(false);
      return;
    }

    try {
      const currentUser = await authApi.me(currentToken);
      setToken(currentToken);
      setUser(currentUser);
    } catch {
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  const login = useCallback(
    async (payload: LoginPayload) => {
      const response = await authApi.login(payload);

      if ('accessToken' in response) {
        completeSession(response);
        return response;
      }

      setTwoFactorToken(response.twoFactorToken);
      return response;
    },
    [completeSession],
  );

  useEffect(() => {
    queueMicrotask(() => {
      void refreshUser();
    });
  }, [refreshUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      isLoading,
      login,
      completeSession,
      refreshUser,
      logout,
    }),
    [completeSession, isLoading, login, logout, refreshUser, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
