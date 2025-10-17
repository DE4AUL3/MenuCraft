'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Copy } from 'lucide-react';
import { dataService } from '@/lib/dataService';
import { Order } from '@/types/common';
import { useLanguage } from '@/hooks/useLanguage';
import OrderCard from '../OrderCard';
import toast from 'react-hot-toast';

interface OrdersModuleProps {
  className?: string;
}

const OrdersModule: React.FC<OrdersModuleProps> = ({ className = '' }) => {
  const { currentLanguage } = useLanguage();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'history' | 'analytics'>('active');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'amount'>('newest');
  const [loading, setLoading] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Загрузка заказов
  useEffect(() => {
    loadOrders();
    
    const handleOrderUpdate = () => {
      loadOrders();
    };

    dataService.addEventListener('order_created', handleOrderUpdate);
    dataService.addEventListener('order_updated', handleOrderUpdate);

    return () => {
      dataService.removeEventListener('order_created', handleOrderUpdate);
      dataService.removeEventListener('order_updated', handleOrderUpdate);
    };
  }, [activeTab]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      
      // В будущем здесь будет запрос к API, но пока используем демо данные
      dataService.createDemoOrders();
      const ordersData = dataService.getOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error('Ошибка загрузки заказов:', error);
      toast.error(
        currentLanguage === 'ru' 
          ? 'Не удалось загрузить заказы' 
          : 'Sargytlary ýükläp bolmady',
        { duration: 3000 }
      );
    } finally {
      setLoading(false);
    }
  };

  // Фильтрация и сортировка заказов
  const filteredOrders = useMemo(() => {
    let filtered = orders;

    // Фильтр по статусу
    if (activeTab === 'active') {
      filtered = filtered.filter(order => 
        ['new', 'pending', 'confirmed', 'preparing', 'delivering', 'ready'].includes(order.status as string)
      );
    } else if (activeTab === 'history') {
      filtered = filtered.filter(order => 
        ['completed', 'delivered', 'cancelled'].includes(order.status as string)
      );
    }

    // Фильтр по конкретному статусу
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter as Order['status']);
    }

    // Поиск
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order => 
        order.customerName.toLowerCase().includes(query) ||
        order.customerPhone.includes(query) ||
        order.id.toLowerCase().includes(query)
      );
    }

    // Сортировка
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'amount':
          return b.totalAmount - a.totalAmount;
        default:
          return 0;
      }
    });

    return filtered;
  }, [orders, activeTab, statusFilter, searchQuery, sortBy]);

  // Обновление статуса заказа
  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      setLoading(true);
      
      // В будущем здесь будет запрос к API
      dataService.updateOrderStatus(orderId, newStatus);
      await loadOrders();
      
      // Обновляем выбранный заказ если он открыт
      if (selectedOrder && selectedOrder.id === orderId) {
        const updatedOrder = dataService.getOrderById(orderId);
        setSelectedOrder(updatedOrder);
      }
      
      toast.success(
        currentLanguage === 'ru' 
          ? 'Статус заказа обновлен' 
          : 'Sargydyň ýagdaýy täzelendi',
        { duration: 2000 }
      );
    } catch (error) {
      console.error('Ошибка обновления статуса:', error);
      toast.error(
        currentLanguage === 'ru' 
          ? 'Не удалось обновить статус заказа' 
          : 'Sargyt ýagdaýyny täzeläp bolmady',
        { duration: 3000 }
      );
    } finally {
      setLoading(false);
    }
  };

  // Статистика для вкладки аналитики
  const analytics = useMemo(() => {
    const today = new Date();
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const todayOrders = orders.filter(order => 
      new Date(order.createdAt).toDateString() === today.toDateString()
    );
    
    const weekOrders = orders.filter(order => 
      new Date(order.createdAt) >= thisWeek
    );

    const monthOrders = orders.filter(order => 
      new Date(order.createdAt) >= thisMonth
    );

    const completedOrders = orders.filter(order => 
      order.status === 'delivered' || order.status === 'completed'
    );

    return {
      todayCount: todayOrders.length,
      todayRevenue: todayOrders.reduce((sum, order) => sum + order.totalAmount, 0),
      weekCount: weekOrders.length,
      weekRevenue: weekOrders.reduce((sum, order) => sum + order.totalAmount, 0),
      monthCount: monthOrders.length,
      monthRevenue: monthOrders.reduce((sum, order) => sum + order.totalAmount, 0),
      totalCompleted: completedOrders.length,
      totalRevenue: completedOrders.reduce((sum, order) => sum + order.totalAmount, 0),
      averageOrderValue: completedOrders.length > 0 
        ? completedOrders.reduce((sum, order) => sum + order.totalAmount, 0) / completedOrders.length 
        : 0
    };
  }, [orders]);

  const getStatusBadgeClass = (status: Order['status']) => {
    const baseClass = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (status) {
      case 'new':
      case 'pending':
        return `${baseClass} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`;
      case 'confirmed':
        return `${baseClass} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`;
      case 'preparing':
        return `${baseClass} bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200`;
      case 'ready':
        return `${baseClass} bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200`;
      case 'delivering':
        return `${baseClass} bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200`;
      case 'delivered':
      case 'completed':
        return `${baseClass} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
      case 'cancelled':
        return `${baseClass} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
      default:
        return baseClass;
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'new':
      case 'pending':
        return currentLanguage === 'ru' ? 'Новый' : 'Täze';
      case 'confirmed':
        return currentLanguage === 'ru' ? 'Подтвержден' : 'Tassyklandy';
      case 'preparing':
        return currentLanguage === 'ru' ? 'Готовится' : 'Taýýarlanýar';
      case 'ready':
        return currentLanguage === 'ru' ? 'Готов' : 'Taýýar';
      case 'delivering':
        return currentLanguage === 'ru' ? 'Доставляется' : 'Eltip berilýär';
      case 'delivered':
        return currentLanguage === 'ru' ? 'Доставлен' : 'Eltip berildi';
      case 'completed':
        return currentLanguage === 'ru' ? 'Завершен' : 'Tamamlandy';
      case 'cancelled':
        return currentLanguage === 'ru' ? 'Отменен' : 'Ýatyryldy';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(currentLanguage === 'ru' ? 'ru-RU' : 'tk-TM', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} ТМ`;
  };
  
  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  return (
    <div className={`orders-module ${className}`}>
      {/* Заголовок */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {currentLanguage === 'ru' ? 'Управление заказами' : 'Sargyt dolandyryş'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {currentLanguage === 'ru' 
            ? 'Отслеживайте и управляйте заказами ресторана' 
            : 'Restoraň sargytlaryny yzarlaň we dolandyryň'
          }
        </p>
      </div>

      {/* Вкладки */}
      <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {['active', 'history', 'analytics'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab === 'active' && (currentLanguage === 'ru' ? 'Активные' : 'Işjeň')}
            {tab === 'history' && (currentLanguage === 'ru' ? 'История' : 'Taryh')}
            {tab === 'analytics' && (currentLanguage === 'ru' ? 'Аналитика' : 'Analitika')}
          </button>
        ))}
      </div>

      {activeTab === 'analytics' ? (
        /* Вкладка аналитики */
        <div className="space-y-6">
          {/* Карточки статистики */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {currentLanguage === 'ru' ? 'За сегодня' : 'Şu gün'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analytics.todayCount}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatCurrency(analytics.todayRevenue)}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {currentLanguage === 'ru' ? 'За неделю' : 'Şu hepde'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analytics.weekCount}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatCurrency(analytics.weekRevenue)}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {currentLanguage === 'ru' ? 'За месяц' : 'Şu aý'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analytics.monthCount}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatCurrency(analytics.monthRevenue)}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {currentLanguage === 'ru' ? 'Средний чек' : 'Ortaça çek'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(analytics.averageOrderValue)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {currentLanguage === 'ru' ? 'из' : ''} {analytics.totalCompleted} {currentLanguage === 'ru' ? 'заказов' : 'sargyt'}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                  <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* График заказов (заглушка) */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {currentLanguage === 'ru' ? 'Статистика заказов' : 'Sargyt statistikasy'}
            </h3>
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p>{currentLanguage === 'ru' ? 'График будет добавлен в следующих обновлениях' : 'Grafik indiki täzelenmelerikde goşular'}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Вкладки активных заказов и истории */
        <div className="space-y-4">
          {/* Фильтры и поиск */}
          <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            {/* Поиск */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder={currentLanguage === 'ru' ? 'Поиск по имени, телефону или ID заказа...' : 'At, telefon ýa-da sargyt ID boýunça gözleg...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>

            {/* Фильтр по статусу */}
            <div className="w-full sm:w-48 relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none"
              >
                <option value="all">{currentLanguage === 'ru' ? 'Все статусы' : 'Ähli ýagdaýlar'}</option>
                {activeTab === 'active' && (
                  <>
                    <option value="new">{currentLanguage === 'ru' ? 'Новые' : 'Täze'}</option>
                    <option value="pending">{currentLanguage === 'ru' ? 'Ожидающие' : 'Garaşýan'}</option>
                    <option value="confirmed">{currentLanguage === 'ru' ? 'Подтвержденные' : 'Tassyklanan'}</option>
                    <option value="preparing">{currentLanguage === 'ru' ? 'Готовятся' : 'Taýýarlanan'}</option>
                    <option value="ready">{currentLanguage === 'ru' ? 'Готовые' : 'Taýýar'}</option>
                    <option value="delivering">{currentLanguage === 'ru' ? 'Доставляются' : 'Eltilýän'}</option>
                  </>
                )}
                {activeTab === 'history' && (
                  <>
                    <option value="completed">{currentLanguage === 'ru' ? 'Завершенные' : 'Tamamlanan'}</option>
                    <option value="delivered">{currentLanguage === 'ru' ? 'Доставленные' : 'Eltilen'}</option>
                    <option value="cancelled">{currentLanguage === 'ru' ? 'Отмененные' : 'Ýatyrlan'}</option>
                  </>
                )}
              </select>
              <Filter className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>

            {/* Сортировка */}
            <div className="w-full sm:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="newest">{currentLanguage === 'ru' ? 'Сначала новые' : 'Täzeler öň'}</option>
                <option value="oldest">{currentLanguage === 'ru' ? 'Сначала старые' : 'Köneler öň'}</option>
                <option value="amount">{currentLanguage === 'ru' ? 'По сумме' : 'Jemi boýunça'}</option>
              </select>
            </div>
          </div>

          {/* Список заказов */}
          {loading && (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          )}
          
          {!loading && filteredOrders.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-gray-600 dark:text-gray-400">
                {currentLanguage === 'ru' ? 'Заказы не найдены' : 'Sargyt tapylmady'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrders.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onClick={() => openOrderDetails(order)}
                  onStatusChange={updateOrderStatus}
                  activeTab={activeTab}
                  loading={loading}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Модальное окно с деталями заказа */}
      {selectedOrder && isDetailModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {currentLanguage === 'ru' ? 'Детали заказа' : 'Sargyt jikme-jiklikleri'} #{selectedOrder.id.slice(-6)}
              </h2>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Информация о клиенте */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {currentLanguage === 'ru' ? 'Информация о клиенте' : 'Müşderi maglumat'}
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                  <p className="flex justify-between">
                    <span className="font-medium">{currentLanguage === 'ru' ? 'Имя:' : 'Ady:'}</span>
                    <span>{selectedOrder.customerName}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium">{currentLanguage === 'ru' ? 'Телефон:' : 'Telefon:'}</span>
                    <span className="flex items-center">
                      {selectedOrder.customerPhone}
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(selectedOrder.customerPhone);
                          toast.success(currentLanguage === 'ru' ? 'Скопировано!' : 'Göçürildi!');
                        }}
                        className="ml-2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                      >
                        <Copy className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      </button>
                    </span>
                  </p>
                  {selectedOrder.customerAddress && (
                    <p className="flex justify-between">
                      <span className="font-medium">{currentLanguage === 'ru' ? 'Адрес:' : 'Salgy:'}</span>
                      <span>{selectedOrder.customerAddress}</span>
                    </p>
                  )}
                  {selectedOrder.notes && (
                    <p className="flex justify-between">
                      <span className="font-medium">{currentLanguage === 'ru' ? 'Комментарий:' : 'Bellik:'}</span>
                      <span>{selectedOrder.notes}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Состав заказа */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {currentLanguage === 'ru' ? 'Состав заказа' : 'Sargyt düzümi'}
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {currentLanguage === 'ru' ? item.dishName : item.dishNameTk}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatCurrency(item.price)} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(item.total)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Итого */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      {currentLanguage === 'ru' ? 'Сумма заказа:' : 'Sargyt jemi:'}
                    </span>
                    <span className="font-medium">{formatCurrency(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      {currentLanguage === 'ru' ? 'Доставка:' : 'Eltip berme:'}
                    </span>
                    <span className="font-medium">{formatCurrency(selectedOrder.deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-gray-700 pt-2">
                    <span>{currentLanguage === 'ru' ? 'Итого:' : 'Jemi:'}</span>
                    <span>{formatCurrency(selectedOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Информация о заказе */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {currentLanguage === 'ru' ? 'Информация о заказе' : 'Sargyt maglumat'}
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                  <p className="flex justify-between">
                    <span className="font-medium">{currentLanguage === 'ru' ? 'Статус:' : 'Ýagdaý:'}</span>
                    <span className={getStatusBadgeClass(selectedOrder.status)}>
                      {getStatusText(selectedOrder.status)}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium">{currentLanguage === 'ru' ? 'Создан:' : 'Döredilen:'}</span>
                    <span>{formatDate(selectedOrder.createdAt)}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium">{currentLanguage === 'ru' ? 'Обновлен:' : 'Täzelenen:'}</span>
                    <span>{formatDate(selectedOrder.updatedAt)}</span>
                  </p>
                  {selectedOrder.completedAt && (
                    <p className="flex justify-between">
                      <span className="font-medium">{currentLanguage === 'ru' ? 'Завершен:' : 'Tamamlanan:'}</span>
                      <span>{formatDate(selectedOrder.completedAt)}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Кнопки управления статусом для активных заказов */}
              {activeTab === 'active' && (
                <div className="pt-4 flex gap-4 flex-wrap">
                  {selectedOrder.status === 'new' || selectedOrder.status === 'pending' ? (
                    <button
                      onClick={() => updateOrderStatus(selectedOrder.id, 'confirmed')}
                      className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                    >
                      {currentLanguage === 'ru' ? 'Подтвердить' : 'Tassykla'}
                    </button>
                  ) : null}
                  
                  {selectedOrder.status === 'confirmed' && (
                    <button
                      onClick={() => updateOrderStatus(selectedOrder.id, 'preparing')}
                      className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg"
                    >
                      {currentLanguage === 'ru' ? 'Готовится' : 'Taýýarlanýar'}
                    </button>
                  )}
                  
                  {selectedOrder.status === 'preparing' && (
                    <button
                      onClick={() => updateOrderStatus(selectedOrder.id, 'ready')}
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                      {currentLanguage === 'ru' ? 'Готово' : 'Taýýar'}
                    </button>
                  )}
                  
                  {selectedOrder.status === 'ready' && (
                    <button
                      onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}
                      className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                    >
                      {currentLanguage === 'ru' ? 'Доставлено' : 'Eltip berildi'}
                    </button>
                  )}
                  
                  {/* Кнопка отмены заказа всегда доступна для активных заказов */}
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                  >
                    {currentLanguage === 'ru' ? 'Отменить заказ' : 'Sargydy ýatyrmak'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersModule;
