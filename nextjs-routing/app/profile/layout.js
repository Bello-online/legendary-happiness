import ProfileNav from '@/components/ProfileNav';

export default function ProfileLayout({ children }) {
  return (
    <div style={{ display: 'flex' }}>
      <ProfileNav />
      <div style={{ marginLeft: '1rem' }}>{children}</div>
    </div>
  );
}