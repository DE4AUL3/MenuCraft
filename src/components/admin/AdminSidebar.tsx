import React, { useState } from 'react';
import AdminLanguageToggle from './AdminLanguageToggle';
import { Bell } from 'lucide-react';
import { Eye, Store, FileText, Phone, Users, MessageSquare, ShoppingBag, TrendingUp, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { COLORS } from '@/config/colors';
import { defaultConfig } from '@/config/restaurant';
import { getText, translations } from '@/i18n/translations';

const adminMenu: { id: string; labelKey: 'overview' | 'restaurant' | 'orders' | 'contacts'; icon: React.ReactNode; path: string }[] = [
  { id: 'overview', labelKey: 'overview', icon: <Eye className="w-5 h-5" />, path: '/admin' },
  { id: 'restaurant', labelKey: 'restaurant', icon: <Store className="w-5 h-5" />, path: '/admin/restaurant' },
  { id: 'orders', labelKey: 'orders', icon: <FileText className="w-5 h-5" />, path: '/admin/orders' },
  { id: 'contacts', labelKey: 'contacts', icon: <Phone className="w-5 h-5" />, path: '/admin/contacts' },
];


import type { Language } from '@/i18n/translations';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange?: (tab: string) => void;
  ordersCount?: number;
  navigationTabs: Array<any>;
}
import { useLanguage } from '@/hooks/useLanguage';
const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, onTabChange, ordersCount = 0, navigationTabs }) => {
  const { currentLanguage: language, setCurrentLanguage: setLanguage } = useLanguage();
  const [collapsed, setCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(true);
  const logo = defaultConfig.restaurant.logo;
  const restaurantName = defaultConfig.restaurant.name;

  // Переводы для меню и футера
  const menuTranslations = {
    overview: { ru: 'Обзор', tk: 'Syn' },
    restaurant: { ru: 'Ресторан', tk: 'Restoran' },
    orders: { ru: 'Заказы', tk: 'Sargytlar' },
    contacts: { ru: 'Контакты', tk: 'Habarlaşmak' },
  };
  const copyright = {
    ru: `© ${new Date().getFullYear()} ${restaurantName}`,
    tk: `© ${new Date().getFullYear()} ${restaurantName}`,
  };

  // Красивые кнопки языка
  const renderLanguageButtons = () => (
    <div className="flex gap-2">
      <button
        className={`px-2.5 py-1.5 rounded-lg text-sm font-semibold border transition-all duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${language === 'ru' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
        onClick={() => setLanguage('ru')}
        aria-pressed={language === 'ru'}
      >
        Русский
      </button>
      <button
        className={`px-2.5 py-1.5 rounded-lg text-sm font-semibold border transition-all duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${language === 'tk' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
        onClick={() => setLanguage('tk')}
        aria-pressed={language === 'tk'}
      >
        Türkmençe
      </button>
    </div>
  );

  return (
    <aside
  className={`h-full shrink-0 border-r bg-white transition-all duration-300 flex flex-col ${collapsed ? 'w-16' : 'w-60'}`}
      style={{
        background: COLORS.background,
        borderColor: COLORS.border,
        color: COLORS.text,
        boxShadow: '2px 0 8px 0 rgba(0,0,0,0.03)',
        zIndex: 20
      }}
    >
      {/* Хедер сайдбара без лого */}
      <div className={`flex items-center gap-2 px-4 py-3 border-b`} style={{ borderColor: COLORS.border, minHeight: 56 }}>
        <span
          className={`font-bold text-lg whitespace-nowrap transition-all duration-300 ${collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}
          style={{ color: COLORS.admin, overflow: 'hidden' }}
        >
          {restaurantName}
        </span>
        <button
          aria-label={collapsed ? 'Развернуть меню' : 'Свернуть меню'}
          className="ml-auto p-1 rounded hover:bg-gray-100 transition-colors"
          style={{ color: COLORS.admin }}
          onClick={() => setCollapsed((v) => !v)}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20" style={{ transform: collapsed ? 'rotate(180deg)' : undefined }}>
            <path d="M7 15l5-5-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      {/* Язык */}
      <div className={`flex items-center gap-2 px-4 py-2 border-b transition-all duration-300 ${collapsed ? 'justify-center' : 'justify-between'}`} style={{ borderColor: COLORS.border, minHeight: 44 }}>
        <div className={collapsed ? 'hidden' : ''}>
          {renderLanguageButtons()}
        </div>
      </div>
      {/* Кнопка уведомлений */}
      <div className={`flex items-center px-4 py-2 border-b transition-all duration-300 ${collapsed ? 'justify-center' : 'justify-start'}`} style={{ borderColor: COLORS.border, minHeight: 44 }}>
        <button
          aria-label={showNotifications ? 'Отключить уведомления' : 'Включить уведомления'}
          className={`p-1 rounded hover:bg-gray-100 transition-colors`}
          style={{ color: showNotifications ? COLORS.admin : COLORS.textMuted, background: showNotifications ? COLORS.admin + '11' : undefined }}
          onClick={() => setShowNotifications((v) => !v)}
          title={showNotifications ? 'Уведомления включены' : 'Уведомления выключены'}
        >
          <Bell className="w-5 h-5" fill={showNotifications ? COLORS.admin : 'none'} />
        </button>
      </div>
      {/* Меню */}
      <nav className="flex-1 flex flex-col gap-1 py-4 px-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
        {navigationTabs.map((item, idx) => (
          <React.Fragment key={item.id}>
            <button
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 w-full ${activeTab === item.id ? 'bg-blue-100' : 'hover:bg-gray-100'} ${collapsed ? 'justify-center px-2' : ''}`}
              style={{
                background: activeTab === item.id ? COLORS.admin + '22' : undefined,
                color: activeTab === item.id ? COLORS.admin : COLORS.text,
                minHeight: 44,
              }}
              onClick={() => onTabChange?.(item.id)}
              title={item.label}
            >
              {item.icon}
              {!collapsed && <span>{item.label}
                {/* Бейдж для заказов */}
                {item.id === 'orders' && (
                  <span className="ml-2 inline-flex items-center justify-center rounded-full bg-green-500 text-white text-xs font-bold px-2 min-w-[22px] h-5" style={{lineHeight: '20px'}}>
                    {ordersCount}
                  </span>
                )}
              </span>}
            </button>
            {/* Разделитель после первых двух пунктов */}
            {idx === 1 && <div className={`my-2 border-t`} style={{ borderColor: COLORS.border, opacity: 0.5 }} />}
          </React.Fragment>
        ))}
      </nav>
      {/* Футер */}
      <div className={`py-2 px-2 text-xs text-gray-400 transition-all duration-300 ${collapsed ? 'opacity-0' : 'opacity-100'}`}
        style={{ fontSize: 11 }}>
        {copyright[language]}
      </div>
    </aside>
  );
}
export default AdminSidebar;
