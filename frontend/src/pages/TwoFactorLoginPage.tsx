import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { AuthShell } from '../components/layout/AuthShell';
import { ActionLink } from '../components/ui/ActionLink';
import { Alert } from '../components/ui/Alert';
import { SecurityCodeForm } from '../components/auth/SecurityCodeForm';
import { useAuth } from '../context/useAuth';
import { clearTwoFactorToken, getTwoFactorToken } from '../utils/tokenStorage';

export function TwoFactorLoginPage() {
  const { completeSession } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const twoFactorToken = getTwoFactorToken();

  async function handleSubmit(code: string) {
    setError('');

    if (!twoFactorToken) {
      setError('No encontramos una verificacion 2FA pendiente.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.verifyTwoFactorLogin(twoFactorToken, code);
      completeSession(response);
      navigate('/dashboard');
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'No pudimos validar el codigo.',
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Segundo factor"
      title="Confirma tu acceso"
      description="Ingresa el codigo de 6 digitos enviado a tu correo. Este token temporal no abre rutas protegidas."
    >
      <div className="form-heading">
        <p className="eyebrow">2FA por correo</p>
        <h2>Verificacion de inicio de sesion</h2>
      </div>

      {error ? <Alert type="error" message={error} /> : null}
      {!twoFactorToken ? (
        <Alert
          type="warning"
          message="Debes iniciar sesion nuevamente para solicitar un codigo."
        />
      ) : null}

      <SecurityCodeForm
        submitLabel="Verificar y entrar"
        isLoading={isLoading}
        onSubmit={handleSubmit}
      />

      <div className="form-links">
        <ActionLink
          to="/login"
          onClick={() => {
            clearTwoFactorToken();
          }}
        >
          Volver al login
        </ActionLink>
      </div>
    </AuthShell>
  );
}
