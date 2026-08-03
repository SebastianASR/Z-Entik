import type { ReactNode } from 'react';
import heroImage from '../../assets/hero.png';
import { ActionLink } from '../ui/ActionLink';
import { AppFooter } from './AppFooter';

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
}: AuthShellProps) {
  return (
    <main className="auth-shell">
      <section className="auth-brand-panel">
        <ActionLink to="/" className="brand-mark">
          <span>Z</span>
          <div>
            <strong>Z-Entik</strong>
            <small>Z Labs</small>
          </div>
        </ActionLink>
        <div className="auth-visual">
          <img src={heroImage} alt="" />
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
        </div>
        <div className="auth-proof-grid">
          <span>JWT seguro</span>
          <span>2FA por correo</span>
          <span>Roles internos</span>
        </div>
      </section>
      <section className="auth-card">{children}</section>
      <AppFooter />
    </main>
  );
}
