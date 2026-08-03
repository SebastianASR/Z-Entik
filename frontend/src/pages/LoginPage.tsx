import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AuthShell } from "../components/layout/AuthShell";
import { ActionLink } from "../components/ui/ActionLink";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { TextField } from "../components/ui/TextField";
import { useAuth } from "../context/useAuth";

const demoAccounts = [
  {
    label: "Usuario demo",
    email: "user.demo@zentik.dev",
    password: "ZentikDemo2026!",
  },
  {
    label: "Técnico demo",
    email: "tech.demo@zentik.dev",
    password: "ZentikDemo2026!",
  },
  {
    label: "Demo Admin",
    email: "admin.demo@zentik.dev",
    password: "ZentikDemo2026!",
  },
];

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function submitLogin(nextEmail = email, nextPassword = password) {
    setError("");
    setIsLoading(true);

    try {
      const response = await login({
        email: nextEmail,
        password: nextPassword,
      });

      if ("twoFactorRequired" in response) {
        navigate("/2fa-login");
        return;
      }

      navigate("/dashboard");
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "No pudimos iniciar sesión.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    await submitLogin();
  }

  return (
    <AuthShell
      eyebrow="Acceso seguro"
      title="Ingresa al centro de soporte"
      description="Administra tu sesión con JWT, correo verificado y 2FA cuando tu cuenta lo requiera."
    >
      <div className="form-heading">
        <p className="eyebrow">Z-Entik</p>
        <h2>Iniciar sesión</h2>
        <p>Usa tus credenciales o entra con una cuenta demo controlada.</p>
      </div>

      {error ? <Alert type="error" message={error} /> : null}

      <form className="stack-form" onSubmit={handleSubmit}>
        <TextField
          label="Correo"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <TextField
          label="Contraseña"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Verificando..." : "Iniciar sesión"}
        </Button>
      </form>

      <div className="form-links">
        <ActionLink to="/forgot-password">Olvidé mi contraseña</ActionLink>
        <ActionLink to="/register">Crear cuenta</ActionLink>
      </div>

      <div className="demo-panel">
        <h3>Usuarios demo</h3>
        <p>
          No son cuentas reales de producción. Sirven para revisar la interfaz.
        </p>
        <div className="demo-grid">
          {demoAccounts.map((account) => (
            <button
              type="button"
              key={account.email}
              onClick={() => {
                setEmail(account.email);
                setPassword(account.password);
                void submitLogin(account.email, account.password);
              }}
            >
              <strong>{account.label}</strong>
              <span>{account.email}</span>
            </button>
          ))}
        </div>
      </div>
    </AuthShell>
  );
}
