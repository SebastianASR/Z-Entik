import { useNavigate } from 'react-router-dom';
import heroImage from '../assets/hero.png';
import { AppFooter } from '../components/layout/AppFooter';
import { ActionLink } from '../components/ui/ActionLink';
import { Button } from '../components/ui/Button';
import { ThemeToggle } from '../components/ui/ThemeToggle';

const benefits = [
  {
    title: 'Gestión de tickets',
    text: 'Base visual preparada para ordenar solicitudes, prioridades y seguimiento interno.',
  },
  {
    title: 'Roles y seguridad',
    text: 'Accesos diferenciados para usuarios, técnicos y administradores.',
  },
  {
    title: '2FA por correo',
    text: 'Verificación adicional para proteger sesiones sensibles.',
  },
  {
    title: 'Soporte organizado',
    text: 'Un punto de entrada claro para equipos TI y usuarios internos.',
  },
];

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <main className="landing-page">
      <header className="topbar">
        <ActionLink to="/" className="brand-mark">
          <span>Z</span>
          <div>
            <strong>Z-Entik</strong>
            <small>Z Labs</small>
          </div>
        </ActionLink>
        <div className="topbar-actions">
          <nav>
            <ActionLink to="/login">Iniciar sesión</ActionLink>
            <ActionLink to="/register">Crear cuenta</ActionLink>
          </nav>
          <ThemeToggle />
        </div>
      </header>

      <section className="landing-hero">
        <div className="hero-copy">
          <p className="eyebrow">HelpDesk TI seguro</p>
          <h1>Z-Entik</h1>
          <p>
            Sistema HelpDesk TI para gestion de tickets, usuarios y soporte
            interno.
          </p>
          <div className="hero-actions">
            <Button onClick={() => navigate('/login')}>Iniciar sesión</Button>
            <Button variant="secondary" onClick={() => navigate('/register')}>
              Crear cuenta
            </Button>
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Probar demo
            </Button>
          </div>
        </div>
        <div className="hero-product-panel" aria-hidden="true">
          <img src={heroImage} alt="" />
          <div className="terminal-preview">
            <span className="terminal-line green">seguridad.activa = true</span>
            <span className="terminal-line cyan">rol.usuario = ADMIN</span>
            <span className="terminal-line">tickets.abiertos = 24</span>
            <span className="terminal-line">2fa.correo = habilitado</span>
          </div>
        </div>
      </section>

      <section className="benefit-grid">
        {benefits.map((benefit) => (
          <article className="benefit-card" key={benefit.title}>
            <span className="benefit-icon" />
            <h2>{benefit.title}</h2>
            <p>{benefit.text}</p>
          </article>
        ))}
      </section>

      <section className="landing-band">
        <div>
          <p className="eyebrow">Producto SaaS moderno</p>
          <h2>Autenticación, verificación y 2FA ya integrados</h2>
        </div>
        <ActionLink className="button button-primary" to="/login">
          Entrar al panel
        </ActionLink>
      </section>

      <AppFooter />
    </main>
  );
}
