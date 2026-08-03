import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';

type ActionLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  to: string;
  children: ReactNode;
};

export function ActionLink({ to, children, onClick, ...props }: ActionLinkProps) {
  return (
    <Link to={to} onClick={onClick} {...props}>
      {children}
    </Link>
  );
}
