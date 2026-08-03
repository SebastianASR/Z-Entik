import { useState, type FormEvent } from 'react';
import { authApi } from '../api/authApi';
import { AuthShell } from '../components/layout/AuthShell';
import { ActionLink } from '../components/ui/ActionLink';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { TextField } from '../components/ui/TextField';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsLoading(true);

    try {
      await authApi.forgotPassword({ email });
    } finally {
      setMessage(
        'Si el correo existe, recibiras instrucciones para restablecer tu contrasena.',
      );
      setIsLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Recuperacion"
      title="Restablece el acceso"
      description="Te enviaremos un enlace temporal por correo si la cuenta existe."
    >
      <div className="form-heading">
        <p className="eyebrow">Cuenta</p>
        <h2>Olvide mi contrasena</h2>
      </div>

      {message ? <Alert type="success" message={message} /> : null}

      <form className="stack-form" onSubmit={handleSubmit}>
        <TextField
          label="Correo"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Enviando...' : 'Enviar instrucciones'}
        </Button>
      </form>

      <div className="form-links">
        <ActionLink to="/login">Volver a iniciar sesion</ActionLink>
      </div>
    </AuthShell>
  );
}
