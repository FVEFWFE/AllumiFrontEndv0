'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAttributionInit, usePageTracking } from '@/hooks/useAttribution';

interface AttributionContextType {
  isTracking: boolean;
}

const AttributionContext = createContext<AttributionContextType>({
  isTracking: false,
});

export function useAttributionContext() {
  return useContext(AttributionContext);
}

interface AttributionProviderProps {
  children: ReactNode;
  userId?: string;
  communityId?: string;
}

export function AttributionProvider({ 
  children, 
  userId,
  communityId 
}: AttributionProviderProps) {
  // Initialize attribution tracking
  useAttributionInit(userId, communityId);
  
  // Track page views automatically
  usePageTracking();
  
  return (
    <AttributionContext.Provider value={{ isTracking: true }}>
      {children}
    </AttributionContext.Provider>
  );
}