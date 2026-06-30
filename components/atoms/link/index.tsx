// components/atoms/AppLink.tsx
import Link, { LinkProps } from 'next/link';
import { ReactNode } from 'react';

interface AppLinkProps extends LinkProps {
  children: ReactNode;
  className?: string;
  // Puedes añadir más props personalizadas si las necesitas (ej. variants)
}

const AppLink = ({ children, className = '', ...props }: AppLinkProps) => {
  return (
    <Link
      className={`text-blue-600 hover:text-blue-800 transition-colors duration-200 ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
};

export default AppLink;
