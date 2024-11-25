import styles from './Profile.module.css';
import Image from 'next/image';

export default function ProfileDetailsPage() {
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Profile Details</h2>
      <p className={styles.text}>Welcome to your profile details page.</p>
      <div className={styles.imageContainer}>
        <Image
          src="/details.png" 
          alt="About"
          width={600} 
          height={400} 
          className={styles.image}
        />
      </div>
    </div>
  );
}
