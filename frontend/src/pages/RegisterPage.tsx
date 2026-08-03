import { useState, type FormEvent } from 'react';
import { authApi } from '../api/authApi';
import { AuthShell } from '../components/layout/AuthShell';
import { ActionLink } from '../components/ui/ActionLink';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { TextField } from '../components/ui/TextField';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.register({ name, email, password });
      setSuccess(response.message);
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'No pudimos crear la cuenta.',
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Nueva cuenta"
      title="Crea tu acceso Z-Entik"
      description="Registro con verificación por correo para mantener el entorno de soporte bajo control."
    >
      <div className="form-heading">
        <p className="eyebrow">Onboarding seguro</p>
        <h2>Crear cuenta</h2>
        <p>No iniciaremos sesión automáticamente hasta que verifiques tu correo.</p>
      </div>

      {error ? <Alert type="error" message={error} /> : null}
      {success ? <Alert type="success" message={success} /> : null}

      <form className="stack-form" onSubmit={handleSubmit}>
        <TextField
          label="Nombre"
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          minLength={2}
          required
        />
        <TextField
          label="Correo"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <TextField
          label="Contraseña"
          name="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={8}
          required
        />
        <TextField
          label="Confirmar contraseña"
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          minLength={8}
          required
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creando...' : 'Crear cuenta'}
        </Button>
      </form>

      <div className="form-links">
        <ActionLink to="/login">Ya tengo cuenta</ActionLink>
      </div>
    </AuthShell>
  );
}
