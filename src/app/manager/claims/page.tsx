'use client';

import { ShieldAlert } from 'lucide-react';
import { ManagerPagePlaceholder } from '../components/Placeholder';

export default function ManagerClaims() {
  return (
    <ManagerPagePlaceholder 
      title="Warranty Claims" 
      description="Manage product returns and service requests"
      icon={ShieldAlert}
    />
  );
}
