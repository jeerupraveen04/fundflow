'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { UserDashboard } from '@/components/dashboards/user-dashboard';
import { AdminDashboard } from '@/components/dashboards/admin-dashboard';
import { SuperAdminDashboard } from '@/components/dashboards/super-admin-dashboard';

type Role = 'user' | 'admin' | 'superadmin';

function DashboardContent() {
  const searchParams = useSearchParams();
  const role = (searchParams.get('role') as Role) || 'user';

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">My Dashboard</h1>
        <div className="text-sm font-medium text-muted-foreground capitalize">
          Viewing as: <span className="font-semibold text-foreground">{role}</span>
        </div>
      </div>

      <div>
        {role === 'user' && <UserDashboard />}
        {role === 'admin' && <AdminDashboard />}
        {role === 'superadmin' && <SuperAdminDashboard />}
      </div>
    </div>
  );
}


export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
