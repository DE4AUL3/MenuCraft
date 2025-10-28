"use client";

import { useState } from "react";
import AdminLayout from "../AdminLayout";
import AdminSidebar from "@/components/admin/AdminSidebar";
import OrdersModule from "@/components/admin/modules/OrdersModule";

export default function OrdersPage() {
  const [ordersCount, setOrdersCount] = useState(0);

  return (
    <AdminLayout>
      <div className="flex">
        <AdminSidebar
          ordersCount={ordersCount}
          activeTab="orders"
          language="ru"
          setLanguage={() => {}}
          navigationTabs={[]}
        />
        <main className="flex-1 p-6">
          <OrdersModule setOrdersCount={setOrdersCount} />
        </main>
      </div>
    </AdminLayout>
  );
}
