'use client';

import { PlaceholderPage } from '../components/PlaceholderPage';
import { TrendingUp } from 'lucide-react';

export default function OwnerSales() {
  return (
    <PlaceholderPage 
      title="Sales Analytics" 
      description="Monitor enterprise-wide sales performance, revenue trends, and transaction history."
      icon={TrendingUp}
    />
  );
}
