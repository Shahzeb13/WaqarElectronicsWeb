'use client';

import { TrendingUp } from 'lucide-react';
import { ManagerPagePlaceholder } from '../components/Placeholder';

export default function ManagerSales() {
  return (
    <ManagerPagePlaceholder 
      title="Sales Operations" 
      description="Record new sales and view branch transaction history"
      icon={TrendingUp}
    />
  );
}
