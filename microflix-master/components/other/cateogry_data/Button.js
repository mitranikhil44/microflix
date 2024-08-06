import Link from 'next/link';

const Button = ({ href, onClick, className, children }) => (
  <Link href={href} onClick={onClick} className={`font-semibold border rounded ${className}`}>
    {children}
  </Link>
);

export default Button;
