import { useState, type FormEvent } from "react";
import { Button } from "../ui/Button";

type TicketCommentFormProps = {
  isLoading?: boolean;
  onSubmit: (content: string) => Promise<void>;
};

export function TicketCommentForm({
  isLoading = false,
  onSubmit,
}: TicketCommentFormProps) {
  const [content, setContent] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    await onSubmit(content);
    setContent("");
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <label>
        <span>Nuevo comentario</span>
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Agrega contexto, avances o una respuesta para el equipo..."
          minLength={2}
          maxLength={2000}
          required
        />
      </label>
      <Button type="submit" disabled={isLoading || content.trim().length < 2}>
        {isLoading ? "Publicando..." : "Comentar"}
      </Button>
    </form>
  );
}
