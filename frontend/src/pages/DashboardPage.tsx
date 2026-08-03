import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { ActionLink } from '../components/ui/ActionLink';
import { Button } from '../components/ui/Button';
import { StatusPill } from '../components/ui/StatusPill';
import { useAuth } from '../context/useAuth';

const summaryCards = [
  { label: 'Tickets abiertos', value: '24', tone: 'cyan' },
  { label: 'En progreso', value: '8', tone: 'blue' },
  { label: 'Resueltos', value: '132', tone: 'green' },
  { label: 'Seguridad activa', value: '2FA', tone: 'teal' },
];

export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <section className="dashboard-grid">
        {summaryCards.map((card) => (
          <article className={`metric-card metric-${card.tone}`} key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
            <small>Placeholder visual para la fase de tickets</small>
          </article>
        ))}
      </section>

      <section className="panel-grid">
        <article className="content-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Estado de cuenta</p>
              <h2>{user?.name}</h2>
            </div>
            <StatusPill tone={user?.isDemo ? 'warn' : 'good'}>
              {user?.isDemo ? 'Cuenta demo' : 'Cuenta real'}
            </StatusPill>
          </div>
          <dl className="detail-list">
            <div>
              <dt>Correo</dt>
              <dd>{user?.email}</dd>
            </div>
            <div>
              <dt>Rol</dt>
              <dd>{user?.role}</dd>
            </div>
            <div>
              <dt>Correo verificado</dt>
              <dd>{user?.emailVerifiedAt ? 'Si' : 'No'}</dd>
            </div>
            <div>
              <dt>2FA</dt>
              <dd>{user?.isTwoFactorEnabled ? 'Activado' : 'Desactivado'}</dd>
            </div>
          </dl>
          <div className="button-row">
            <Button onClick={() => navigate('/settings/security')}>
              {user?.isTwoFactorEnabled ? 'Gestionar 2FA' : 'Activar 2FA'}
            </Button>
            <ActionLink className="button button-secondary" to="/settings/security">
              Ir a seguridad
            </ActionLink>
          </div>
        </article>

        <article className="content-panel operations-panel">
          <p className="eyebrow">Operacion TI</p>
          <h2>Flujo de soporte preparado</h2>
          <p>
            El dashboard muestra datos mock por ahora. La siguiente fase puede
            conectar tickets reales sin cambiar la base visual.
          </p>
          <div className="timeline">
            <span>Ingreso</span>
            <span>Clasificacion</span>
            <span>Resolucion</span>
          </div>
        </article>
      </section>
    </DashboardLayout>
  );
}
