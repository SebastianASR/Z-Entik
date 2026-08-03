import { useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/authApi';
import { AuthShell } from '../components/layout/AuthShell';
import { ActionLink } from '../components/ui/ActionLink';
import { Alert } from '../components/ui/Alert';

export function VerifyEmailPage() {
  const token = useMemo(
    () => new URLSearchParams(window.location.search).get('token'),
    [],
  );
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    token ? 'loading' : 'error',
  );

  useEffect(() => {
    if (!token) {
      return;
    }

    authApi
      .verifyEmail(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <AuthShell
      eyebrow="Verificacion de correo"
      title="Validando identidad"
      description="Z-Entik confirma tu dirección antes de habilitar el acceso a la plataforma."
    >
      <div className="form-heading">
        <p className="eyebrow">Correo</p>
        <h2>Verificacion de cuenta</h2>
      </div>

      {status === 'loading' ? (
        <Alert message="Verificando tu correo..." />
      ) : null}
      {status === 'success' ? (
        <Alert
          type="success"
          title="Correo verificado"
          message="Tu cuenta quedó lista para iniciar sesión."
        />
      ) : null}
      {status === 'error' ? (
        <Alert
          type="error"
          title="No pudimos verificar el correo"
          message="El enlace puede ser inválido, haber expirado o haber sido usado."
        />
      ) : null}

      <ActionLink className="button button-primary full-width" to="/login">
        Ir a iniciar sesión
      </ActionLink>
    </AuthShell>
  );
}
