import { DashboardClient } from '@/components/admin/DashboardClient';

export const metadata = {
  title: 'Admin Dashboard | QuadraHub',
  description: 'Painel de controle administrativo do QuadraHub',
};

export default function AdminDashboardPage() {
  return <DashboardClient />;
}
