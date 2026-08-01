import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AdminAuthProvider } from '@/contexts/admin-auth-context';
import { AdminLogoutButton } from './admin-logout-button';

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get('admin_access_token');

  if (!token) {
    redirect('/admin/login');
  }

  return (
    <AdminAuthProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-gray-900 text-white">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <span className="text-lg font-bold">
              Pet360 <span className="text-primary">Plataforma</span>
            </span>
            <AdminLogoutButton />
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">{children}</main>
      </div>
    </AdminAuthProvider>
  );
}
