'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function MarketplacePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/subscriptions');
  }, [router]);

  return null;
}
