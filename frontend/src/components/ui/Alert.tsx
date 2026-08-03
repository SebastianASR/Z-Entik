type AlertProps = {
  type?: 'info' | 'success' | 'error' | 'warning';
  title?: string;
  message: string;
};

export function Alert({ type = 'info', title, message }: AlertProps) {
  return (
    <div className={`alert alert-${type}`} role="status">
      {title ? <strong>{title}</strong> : null}
      <span>{message}</span>
    </div>
  );
}
