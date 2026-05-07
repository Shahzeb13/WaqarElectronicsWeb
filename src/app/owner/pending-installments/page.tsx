'use client';

import { PlaceholderPage } from '../components/PlaceholderPage';
import { Clock } from 'lucide-react';

export default function OwnerPendingInstallments() {
  return (
    <PlaceholderPage 
      title="Pending Installments" 
      description="Monitor overdue payments and upcoming installment deadlines across all branches."
      icon={Clock}
    />
  );
}
