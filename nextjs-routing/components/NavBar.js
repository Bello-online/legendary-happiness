'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './NavBar.module.css';

export default function NavBar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Home' },
    { href: '/feed', label: 'Feed' },
    { href: '/profile', label: 'Profile' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
<nav className={styles.nav}>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`${styles.link} ${pathname === link.href ? styles.active : ''}`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
