import Link from 'next/link';

const Dropdown = ({ items, className }) => (
  <ul className={`absolute hidden top-[100%] rounded-md bg-sky-500 rounded-tl-none text-white group-hover:block z-10 ${className}`}>
    {items.map(({ href, label }, index) => (
      <li key={index}>
        <Link href={href} className="block p-2">
          {label}
        </Link>
        {index + 1 !== items.length && <hr className="rounded-tr-md rounded-br-md" />}
      </li>
    ))}
  </ul>
);

export default Dropdown;
