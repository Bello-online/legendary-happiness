import Link from 'next/link';
import styles from './Item.module.css';

export default function Item({ id, text, datetime, author }) {
  return (
    <div className={styles.item}>
      <p className={styles.text}>{text}</p>
      <p className={styles.datetime}>{datetime}</p>
      <p className={styles.author}>By: {author}</p>
      <Link href={`/feed/${id}`} className={styles.link}>
        View Item
      </Link>
    </div>
  );
}
