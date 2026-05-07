'use client';

import { UserSquare2 } from 'lucide-react';
import { ManagerPagePlaceholder } from '../components/Placeholder';

export default function ManagerCustomers() {
  return (
    <ManagerPagePlaceholder 
      title="Branch Customers" 
      description="Manage customer profiles and credit history"
      icon={UserSquare2}
    />
  );
}
