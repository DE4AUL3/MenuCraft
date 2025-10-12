'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Phone, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeSection?: string;
}

export default function AdminLayout({ children, activeSection = 'dashboard' }: AdminLayoutProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (isAdmin !== 'true') {
      router.push('/admin');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    router.push('/admin');
  };

  const menuItems = [
    { id: 'dashboard', name: 'Панель управления', icon: LayoutDashboard, href: '/admin/dashboard' },
    { id: 'restaurant', name: 'Ресторан', icon: UtensilsCrossed, href: '/admin/restaurant' },
    { id: 'contacts', name: 'Контакты', icon: Phone, href: '/admin/contacts' },
    { id: 'settings', name: 'Настройки', icon: Settings, href: '/admin/settings' },
  ];

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Админ-панель</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  router.push(item.href);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  isActive ? 'bg-emerald-50 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 border-r-2 border-emerald-600' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </button>
            );
          })}
        </nav>
        
        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Выйти
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-white dark:bg-gray-800 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            Админ-панель
          </h1>
          <div className="w-6" /> {/* Spacer */}
        </div>

        {/* Content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}