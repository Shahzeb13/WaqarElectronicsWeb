'use client';

import { CreditCard } from 'lucide-react';
import { ManagerPagePlaceholder } from '../components/Placeholder';

export default function ManagerExpenses() {
  return (
    <ManagerPagePlaceholder 
      title="Branch Expenses" 
      description="Track utility bills and local operational costs"
      icon={CreditCard}
    />
  );
}
