import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ticketsApi } from "../api/ticketsApi";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { TextField } from "../components/ui/TextField";
import { useAuth } from "../context/useAuth";
import type { TicketCategory, TicketPriority } from "../types/ticket";
import {
  categoryLabels,
  priorityLabels,
} from "../components/tickets/ticketLabels";

const priorities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;
const categories = [
  "HARDWARE",
  "SOFTWARE",
  "NETWORK",
  "ACCESS",
  "SECURITY",
  "OTHER",
] as const;

export function CreateTicketPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TicketPriority>("MEDIUM");
  const [category, setCategory] = useState<TicketCategory>("OTHER");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (!token) return;

    if (title.trim().length < 4 || description.trim().length < 12) {
      setError("Completa un titulo y una descripcion con suficiente detalle.");
      return;
    }

    setIsLoading(true);
    try {
      const ticket = await ticketsApi.create(token, {
        title,
        description,
        priority,
        category,
      });
      navigate(`/tickets/${ticket.id}`);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "No pudimos crear el ticket.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <DashboardLayout>
      <section className="content-panel narrow-panel">
        <div className="form-heading">
          <p className="eyebrow">Nuevo requerimiento</p>
          <h2>Crear ticket</h2>
          <p>
            Describe el incidente con contexto suficiente para que soporte pueda
            priorizarlo correctamente.
          </p>
        </div>

        {error ? <Alert type="error" message={error} /> : null}

        <form className="stack-form" onSubmit={handleSubmit}>
          <TextField
            label="Titulo"
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            minLength={4}
            maxLength={120}
            required
          />
          <label className="field" htmlFor="description">
            <span>Descripcion</span>
            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              minLength={12}
              maxLength={4000}
              required
              placeholder="Cuenta que ocurre, desde cuando y que impacto tiene."
            />
          </label>
          <div className="form-grid-two">
            <label className="field" htmlFor="priority">
              <span>Prioridad</span>
              <select
                id="priority"
                value={priority}
                onChange={(event) =>
                  setPriority(event.target.value as TicketPriority)
                }
              >
                {priorities.map((item) => (
                  <option key={item} value={item}>
                    {priorityLabels[item]}
                  </option>
                ))}
              </select>
            </label>
            <label className="field" htmlFor="category">
              <span>Categoria</span>
              <select
                id="category"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value as TicketCategory)
                }
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {categoryLabels[item]}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creando..." : "Crear ticket"}
          </Button>
        </form>
      </section>
    </DashboardLayout>
  );
}
