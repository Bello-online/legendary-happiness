import styles from './ItemPage.module.css';

export default function FeedItemPage({ params }) {
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Item Details</h2>
      <p className={styles.text}>The ID of the item is {params.itemid}.</p>
    </div>
  );
}
