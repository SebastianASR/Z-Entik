import { useMemo, useState, type FormEvent } from 'react';
import { authApi } from '../api/authApi';
import { AuthShell } from '../components/layout/AuthShell';
import { ActionLink } from '../components/ui/ActionLink';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { TextField } from '../components/ui/TextField';

export function ResetPasswordPage() {
  const token = useMemo(
    () => new URLSearchParams(window.location.search).get('token') ?? '',
    [],
  );
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('El enlace no incluye un token valido.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contrasenas no coinciden.');
      return;
    }

    setIsLoading(true);
    try {
      await authApi.resetPassword({ token, newPassword, confirmPassword });
      setSuccess('Contrasena actualizada. Ya puedes iniciar sesion.');
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'No pudimos actualizar la contrasena.',
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Nueva contrasena"
      title="Protege tu cuenta"
      description="Crea una contrasena nueva para recuperar el acceso a Z-Entik."
    >
      <div className="form-heading">
        <p className="eyebrow">Seguridad</p>
        <h2>Restablecer contrasena</h2>
      </div>

      {error ? <Alert type="error" message={error} /> : null}
      {success ? <Alert type="success" message={success} /> : null}

      <form className="stack-form" onSubmit={handleSubmit}>
        <TextField
          label="Nueva contrasena"
          name="newPassword"
          type="password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          minLength={8}
          required
        />
        <TextField
          label="Confirmar contrasena"
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          minLength={8}
          required
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Actualizando...' : 'Actualizar contrasena'}
        </Button>
      </form>

      <div className="form-links">
        <ActionLink to="/login">Ir a iniciar sesion</ActionLink>
      </div>
    </AuthShell>
  );
}
