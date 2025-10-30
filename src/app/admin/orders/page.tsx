"use client";

import { useState } from "react";
import AdminLayout from "../AdminLayout";
import AdminSidebar from "@/components/admin/AdminSidebar";
import OrdersModule from "@/components/admin/modules/OrdersModule";

export default function OrdersPage() {
  const [ordersCount, setOrdersCount] = useState(0);

  // Меню для сайдбара (минимальный набор для orders)
  const navigationTabs = [
    { id: 'overview', label: 'Обзор', icon: null },
    { id: 'restaurant', label: 'Ресторан', icon: null },
    { id: 'orders', label: 'Заказы', icon: null },
    { id: 'contacts', label: 'Контакты', icon: null },
  ];
  return (
    <AdminLayout>
      <div className="flex">
        <AdminSidebar
          ordersCount={ordersCount}
          activeTab="orders"
          navigationTabs={navigationTabs}
        />
        <main className="flex-1 p-6">
          <OrdersModule setOrdersCount={setOrdersCount} />
        </main>
      </div>
    </AdminLayout>
  );
}
