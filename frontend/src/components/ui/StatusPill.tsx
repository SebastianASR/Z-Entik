type StatusPillProps = {
  tone?: 'good' | 'warn' | 'neutral' | 'danger';
  children: string;
};

export function StatusPill({ tone = 'neutral', children }: StatusPillProps) {
  return <span className={`status-pill status-${tone}`}>{children}</span>;
}
