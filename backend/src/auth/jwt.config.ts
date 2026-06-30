import type { SignOptions } from 'jsonwebtoken';

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error(
      'JWT_SECRET environment variable is required for authentication',
    );
  }

  return secret;
}

export function getJwtExpiresIn(): SignOptions['expiresIn'] {
  return (process.env.JWT_EXPIRES_IN ?? '1h') as SignOptions['expiresIn'];
}
