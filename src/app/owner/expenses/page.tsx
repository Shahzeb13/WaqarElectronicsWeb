'use client';

import { PlaceholderPage } from '../components/PlaceholderPage';
import { CreditCard } from 'lucide-react';

export default function OwnerExpenses() {
  return (
    <PlaceholderPage 
      title="Expense Tracking" 
      description="Monitor operational costs, branch utility bills, and enterprise-wide expenditure."
      icon={CreditCard}
    />
  );
}
