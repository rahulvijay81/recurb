'use client';

import { useEffect, useState } from 'react';

export function usePermission(permission: string) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const checkPermission = async () => {
      try {
        const res = await fetch('/api/auth/permissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ permission }),
        });
        setHasPermission(res.ok);
      } catch {
        setHasPermission(false);
      }
    };
    checkPermission();
  }, [permission]);

  return hasPermission;
}
