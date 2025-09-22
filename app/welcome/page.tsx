import { Suspense } from 'react';
import WelcomeContent from './WelcomeContent';

export default function WelcomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <WelcomeContent />
    </Suspense>
  );
}