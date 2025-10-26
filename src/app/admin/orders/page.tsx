"use client";

import { useState } from "react";
import AdminLayout from "../AdminLayout";
import AdminSidebar from "@/components/admin/AdminSidebar";
import OrdersModule from "@/components/admin/modules/OrdersModule";

export default function OrdersPage() {
  const [ordersCount, setOrdersCount] = useState(0);

  // Пример навигационных вкладок для Sidebar
  const navigationTabs = [
    {
      id: 'overview',
      label: 'Обзор',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" /></svg>,
      path: '/admin',
    },
    {
      id: 'orders',
      label: 'Заказы',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 7h18M3 12h18M3 17h18" /></svg>,
      path: '/admin/orders',
    },
    {
      id: 'restaurant',
      label: 'Ресторан',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 4h10a2 2 0 012 2v11a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2z" /></svg>,
      path: '/admin/restaurant',
    },
  ];

  return (
    <AdminLayout>
      <div className="flex min-h-[calc(100vh-32px)] bg-gray-50">
        <aside className="sticky top-0 h-screen z-20">
          <AdminSidebar
            ordersCount={ordersCount}
            activeTab="orders"
            language="ru"
            setLanguage={() => {}}
            navigationTabs={navigationTabs}
          />
        </aside>
        <main className="flex-1 p-6 transition-all duration-300">
          <OrdersModule setOrdersCount={setOrdersCount} />
        </main>
      </div>
    </AdminLayout>
  );
}
