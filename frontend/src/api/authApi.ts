import { apiRequest } from './http';
import type {
  AuthResponse,
  AuthUser,
  ForgotPasswordPayload,
  LoginPayload,
  LoginResponse,
  MessageResponse,
  RegisterPayload,
  RegisterResponse,
  ResetPasswordPayload,
} from '../types/auth';

export const authApi = {
  login(payload: LoginPayload) {
    return apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: payload,
    });
  },
  register(payload: RegisterPayload) {
    return apiRequest<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: payload,
    });
  },
  verifyEmail(token: string) {
    return apiRequest<MessageResponse>('/auth/verify-email', {
      method: 'POST',
      body: { token },
    });
  },
  forgotPassword(payload: ForgotPasswordPayload) {
    return apiRequest<MessageResponse>('/auth/forgot-password', {
      method: 'POST',
      body: payload,
    });
  },
  resetPassword(payload: ResetPasswordPayload) {
    return apiRequest<MessageResponse>('/auth/reset-password', {
      method: 'POST',
      body: payload,
    });
  },
  verifyTwoFactorLogin(twoFactorToken: string, code: string) {
    return apiRequest<AuthResponse>('/auth/2fa/verify-login', {
      method: 'POST',
      body: { twoFactorToken, code },
    });
  },
  me(token: string) {
    return apiRequest<AuthUser>('/auth/me', { token });
  },
  requestEnableTwoFactor(token: string) {
    return apiRequest<MessageResponse>('/auth/2fa/request-enable', {
      method: 'POST',
      token,
    });
  },
  confirmEnableTwoFactor(token: string, code: string) {
    return apiRequest<MessageResponse>('/auth/2fa/confirm-enable', {
      method: 'POST',
      token,
      body: { code },
    });
  },
  requestDisableTwoFactor(token: string) {
    return apiRequest<MessageResponse>('/auth/2fa/request-disable', {
      method: 'POST',
      token,
    });
  },
  confirmDisableTwoFactor(token: string, code: string) {
    return apiRequest<MessageResponse>('/auth/2fa/confirm-disable', {
      method: 'POST',
      token,
      body: { code },
    });
  },
};
