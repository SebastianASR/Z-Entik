export type Role = 'ADMIN' | 'TECHNICIAN' | 'USER';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  isDemo: boolean;
  emailVerifiedAt: string | null;
  isTwoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  token: string;
  newPassword: string;
  confirmPassword: string;
};

export type AuthResponse = {
  accessToken: string;
  user: AuthUser;
};

export type TwoFactorRequiredResponse = {
  twoFactorRequired: true;
  twoFactorToken: string;
  message: string;
};

export type LoginResponse = AuthResponse | TwoFactorRequiredResponse;

export type MessageResponse = {
  message: string;
};

export type RegisterResponse = MessageResponse & {
  user: AuthUser;
};
