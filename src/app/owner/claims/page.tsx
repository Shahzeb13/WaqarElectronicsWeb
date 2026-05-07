'use client';

import { PlaceholderPage } from '../components/PlaceholderPage';
import { ShieldAlert } from 'lucide-react';

export default function OwnerClaims() {
  return (
    <PlaceholderPage 
      title="Warranty & Claims" 
      description="Manage product warranty claims, service requests, and manufacturer communications."
      icon={ShieldAlert}
    />
  );
}
