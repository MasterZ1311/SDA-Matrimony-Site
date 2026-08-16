'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/profile/me');
  }, [router]);

  return (
    <div style={{ padding: '60px 0', textAlign: 'center', backgroundColor: 'var(--bg-page)', minHeight: 'calc(100vh - 150px)' }}>
      <div className="container">
        <p style={{ color: 'var(--text-secondary)' }}>Loading your SDA Matrimonial profile...</p>
      </div>
    </div>
  );
}
