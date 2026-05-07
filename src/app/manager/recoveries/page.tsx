'use client';

import { History } from 'lucide-react';
import { ManagerPagePlaceholder } from '../components/Placeholder';

export default function ManagerRecoveries() {
  return (
    <ManagerPagePlaceholder 
      title="Recovery Tracking" 
      description="Monitor installment collections and payment schedules"
      icon={History}
    />
  );
}
