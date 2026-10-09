'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export const PageLoadingBar: React.FC = () => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 shadow-neon-indigo animate-pulse">
      <div className="h-full bg-white/40 w-1/3 animate-ping"></div>
    </div>
  );
};
