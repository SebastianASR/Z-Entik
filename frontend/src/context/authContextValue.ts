import { createContext } from 'react';
import type { AuthResponse, AuthUser, LoginPayload, LoginResponse } from '../types/auth';

export type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<LoginResponse>;
  completeSession: (response: AuthResponse) => void;
  refreshUser: () => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
