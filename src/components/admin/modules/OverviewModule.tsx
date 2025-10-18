/* Recreated OverviewModule.tsx */
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShoppingBag, DollarSign, Package, Star } from 'lucide-react';
import getThemeClasses from "../../../../config/colors";
import SalesChart from "../SalesChart";

interface OverviewModuleProps {
  onSubTabChange?: (tabId: string) => void;
  theme: string;
}

interface Stat {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: React.ReactNode;
  color: string;
}

interface ActivityItem {
  action: string;
  timestamp: string | number | Date;
}

const OverviewModule: React.FC<OverviewModuleProps> = ({ onSubTabChange, theme }) => {
  const themeClasses = getThemeClasses(theme);
  const [currentSubTab, setCurrentSubTab] = useState('basic');
  const [basicStats, setBasicStats] = useState<Stat[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [salesData, setSalesData] = useState<{ date: string; value: number }[]>([]);

  // Fetch basic stats from API
  useEffect(() => {
    fetch('/api/analytics?type=overview')
      .then(res => res.json())
      .then(realStats => {
        // Проверка на наличие всех нужных полей
        const stats: Stat[] = [
          { title: 'рестораны', value: (realStats?.totalRestaurants ?? 0).toString(), change: '', changeType: 'positive', icon: <ShoppingBag className="w-5 h-5" />, color: 'from-blue-400 to-blue-600' },
          { title: 'выручка', value: `${realStats?.estimatedRevenue ?? 0} ТТ`, change: '', changeType: 'positive', icon: <DollarSign className="w-5 h-5" />, color: 'from-green-400 to-green-600' },
          { title: 'блюд', value: (realStats?.totalDishes ?? 0).toString(), change: '', changeType: 'positive', icon: <Package className="w-5 h-5" />, color: 'from-purple-400 to-purple-600' },
          { title: 'категории', value: (realStats?.totalCategories ?? 0).toString(), change: '', changeType: 'positive', icon: <Star className="w-5 h-5" />, color: 'from-yellow-400 to-orange-500' }
        ];
        setBasicStats(stats);
      })
      .catch(err => console.error(err));
  }, []);

  // Real-time updates: poll sales analytics and recent activity every 10s
  useEffect(() => {
    let mounted = true;

    const fetchSales = async () => {
      try {
        const res = await fetch('/api/analytics?type=sales&days=30');
        if (!res.ok) return;
        const data = await res.json();
        // data: [{ date, sales, orders, customers }]
        if (!mounted) return;
        const chartData = Array.isArray(data) ? data.map((d: any) => ({ date: d.date, value: Math.round(d.sales) })) : [];
        setSalesData(chartData);
      } catch (err) {
        console.error('Ошибка загрузки sales analytics', err);
      }
    };

    const fetchRecent = async () => {
      try {
        // используем /api/orders, который возвращает форматированные данные с createdAt
        const res = await fetch('/api/orders');
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;
        // Ожидаем массив заказов, создаём activity items (последние 10)
        const activities = (Array.isArray(data) ? data : [])
          .slice(0, 10)
          .map((o: any) => ({
            action: `${o.customerPhone || o.customerName || 'Клиент'} — ${o.items?.length ?? 0} позиций — ${o.totalAmount ?? 0} TMT`,
            timestamp: o.createdAt || new Date().toISOString()
          }));
        setRecentActivity(activities);
      } catch (err) {
        console.error('Ошибка загрузки recent orders', err);
      }
    };

    // Initial fetch
    fetchSales();
    fetchRecent();

    const interval = setInterval(() => {
      fetchSales();
      fetchRecent();
    }, 10000); // 10s

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {[{ id: 'basic', label: 'Базовый', icon: <Activity className="w-5 h-5" /> }].map(tab => (
          <button
            key={tab.id}
            onClick={() => { setCurrentSubTab(tab.id); onSubTabChange?.(tab.id); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${currentSubTab === tab.id ? `bg-gradient-to-r ${themeClasses.accent} text-white shadow-xl` : `${themeClasses.cardBg} ${themeClasses.text} ${themeClasses.hover} shadow-md`}`}
          >
            {tab.icon}{tab.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={currentSubTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}>
          {currentSubTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {basicStats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`p-6 rounded-xl relative overflow-hidden transition-all duration-300 hover:scale-105 ${themeClasses.cardBg} shadow-lg`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10`} />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>{stat.icon}</div>
                        <div className={`text-sm font-medium px-3 py-1 rounded-full shadow-md ${stat.changeType === 'positive' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>{stat.change}</div>
                      </div>
                      <h3 className={`text-2xl font-bold mb-1 ${themeClasses.text}`}>{stat.value}</h3>
                      <p className={`text-sm ${themeClasses.textSecondary}`}>{stat.title}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className={`p-6 rounded-xl ${themeClasses.cardBg} shadow-lg`}>
                <SalesChart data={salesData} theme={theme} />
              </div>
              <div className={`p-6 rounded-xl ${themeClasses.cardBg} shadow-lg`}>
                <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${themeClasses.text}`}>
                  <Activity className="w-5 h-5 text-blue-500" /> Последняя активность
                </h3>
                <div className="space-y-3">
                  {recentActivity.length ? recentActivity.map((a, i) => (
                    <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${themeClasses.hover} transition-colors`}>
                      <span className={themeClasses.text}>{a.action}</span>
                      <span className="text-sm">{formatTimeAgo(a.timestamp)}</span>
                    </div>
                  )) : (
                    <p className={themeClasses.text}>Нет активности</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Helper function to format time ago
function formatTimeAgo(timestamp: string | number | Date): string {
  const date = new Date(timestamp);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return interval + " лет назад";
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return interval + " месяцев назад";
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval + " дней назад";
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval + " часов назад";
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval + " минут назад";
  return "секунду назад";
}

export default OverviewModule;
