'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './ProfileNav.module.css';

export default function ProfileNav() {
  const pathname = usePathname();

  const links = [
    { href: '/profile', label: 'Details' },
    { href: '/profile/settings', label: 'Settings' },
    { href: '/profile/posts', label: 'Posts' },
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
