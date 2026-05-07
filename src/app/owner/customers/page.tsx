'use client';

import { PlaceholderPage } from '../components/PlaceholderPage';
import { UserSquare2 } from 'lucide-react';

export default function OwnerCustomers() {
  return (
    <PlaceholderPage 
      title="Customer Directory" 
      description="Detailed customer profiles, purchase history, and credit records for the entire enterprise."
      icon={UserSquare2}
    />
  );
}
