import type { TicketComment } from "../../types/ticket";
import { formatRole } from "../../utils/roleLabels";

export function TicketCommentList({ comments }: { comments: TicketComment[] }) {
  if (!comments.length) {
    return <p className="muted-text">Aun no hay comentarios en este ticket.</p>;
  }

  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <article className="comment-card" key={comment.id}>
          <div>
            <strong>{comment.author.name}</strong>
            <span>{formatRole(comment.author.role)}</span>
          </div>
          <p>{comment.content}</p>
          <small>{new Date(comment.createdAt).toLocaleString()}</small>
        </article>
      ))}
    </div>
  );
}
