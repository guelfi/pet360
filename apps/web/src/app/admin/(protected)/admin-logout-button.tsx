'use client';

export function AdminLogoutButton() {
  const handleLogout = () => {
    document.cookie = 'admin_access_token=; Max-Age=0; path=/';
    document.cookie = 'admin_refresh_token=; Max-Age=0; path=/';
    window.location.href = '/admin/login';
  };

  return (
    <button onClick={handleLogout} className="text-sm text-gray-300 hover:text-white">
      Sair
    </button>
  );
}
