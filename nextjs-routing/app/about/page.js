import Image from 'next/image';
import styles from './About.module.css';

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>About</h2>
      <p className={styles.text}>
        This website is built to demonstrate Next.js routing and layout functionality.
      </p>
      <div className={styles.imageContainer}>
        <Image
          src="/about-image.jpg" 
          alt="About"
          width={600} 
          height={400} 
          className={styles.image}
        />
      </div>
    </div>
  );
}