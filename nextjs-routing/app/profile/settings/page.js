import styles from './Settings.module.css';
import Image from 'next/image';

export default function SettingsPage() {
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Settings</h2>
      <p className={styles.text}>Manage your account settings here.</p>
      <div className={styles.imageContainer}>
        <Image
          src="/settings.png" 
          alt="About"
          width={600} 
          height={400} 
          className={styles.image}
        />
      </div>
    </div>
    
  );
}
