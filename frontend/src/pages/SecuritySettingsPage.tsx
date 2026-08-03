import { useState } from "react";
import { authApi } from "../api/authApi";
import { SecurityCodeForm } from "../components/auth/SecurityCodeForm";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { StatusPill } from "../components/ui/StatusPill";
import { useAuth } from "../context/useAuth";
import { formatRole, isDemoAdmin } from "../utils/roleLabels";

type Flow = "enable" | "disable" | null;

export function SecuritySettingsPage() {
  const { token, user, refreshUser } = useAuth();
  const [flow, setFlow] = useState<Flow>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function requestFlow(nextFlow: Exclude<Flow, null>) {
    if (!token) return;
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      if (nextFlow === "enable") {
        await authApi.requestEnableTwoFactor(token);
        setMessage("Te enviamos un código para activar 2FA.");
      } else {
        await authApi.requestDisableTwoFactor(token);
        setMessage("Te enviamos un código para desactivar 2FA.");
      }
      setFlow(nextFlow);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "No pudimos iniciar el flujo de seguridad.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function confirmFlow(code: string) {
    if (!token || !flow) return;
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      if (flow === "enable") {
        await authApi.confirmEnableTwoFactor(token, code);
        setMessage("2FA quedo activado correctamente.");
      } else {
        await authApi.confirmDisableTwoFactor(token, code);
        setMessage("2FA quedo desactivado correctamente.");
      }
      setFlow(null);
      await refreshUser();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "No pudimos confirmar el código.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <DashboardLayout>
      <section className="panel-grid security-layout">
        <article className="content-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Seguridad de cuenta</p>
              <h2>Controles de acceso</h2>
            </div>
            <StatusPill tone={user?.isTwoFactorEnabled ? "good" : "warn"}>
              {user?.isTwoFactorEnabled ? "2FA activo" : "2FA inactivo"}
            </StatusPill>
          </div>

          {user?.isDemo || isDemoAdmin(user?.role) ? (
            <Alert
              type="warning"
              message={
                isDemoAdmin(user?.role)
                  ? "Esta cuenta demo permite explorar vistas administrativas, pero no puede ejecutar acciones destructivas."
                  : "Esta es una cuenta demo. Algunas acciones pueden estar restringidas."
              }
            />
          ) : null}
          {message ? <Alert type="success" message={message} /> : null}
          {error ? <Alert type="error" message={error} /> : null}

          <dl className="detail-list">
            <div>
              <dt>Correo verificado</dt>
              <dd>{user?.emailVerifiedAt ? "Si" : "No"}</dd>
            </div>
            <div>
              <dt>2FA</dt>
              <dd>{user?.isTwoFactorEnabled ? "Activado" : "Desactivado"}</dd>
            </div>
            <div>
              <dt>Rol</dt>
              <dd>{formatRole(user?.role)}</dd>
            </div>
            <div>
              <dt>Tipo de cuenta</dt>
              <dd>{user?.isDemo ? "Demo" : "Estandar"}</dd>
            </div>
          </dl>

          {!flow ? (
            <div className="button-row">
              {user?.isTwoFactorEnabled ? (
                <Button
                  variant="danger"
                  disabled={isLoading}
                  onClick={() => void requestFlow("disable")}
                >
                  Desactivar 2FA
                </Button>
              ) : (
                <Button
                  disabled={isLoading || !user?.emailVerifiedAt}
                  onClick={() => void requestFlow("enable")}
                >
                  Activar 2FA
                </Button>
              )}
            </div>
          ) : null}
        </article>

        <article className="content-panel">
          <p className="eyebrow">Confirmacion por correo</p>
          <h2>
            {flow === "disable"
              ? "Confirma la desactivacion"
              : "Confirma la activacion"}
          </h2>
          <p className="muted-text">
            Solicita el código y revisa tu correo. El código se marca como usado
            al confirmar y no puede reutilizarse.
          </p>
          {flow ? (
            <SecurityCodeForm
              submitLabel={
                flow === "disable" ? "Confirmar desactivacion" : "Confirmar 2FA"
              }
              isLoading={isLoading}
              onSubmit={confirmFlow}
            />
          ) : (
            <Alert message="Aun no hay un flujo de 2FA pendiente." />
          )}
        </article>
      </section>
    </DashboardLayout>
  );
}
