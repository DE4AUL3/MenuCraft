import React from 'react';
import { Clock, User, Phone, MapPin, Package, ChevronRight } from 'lucide-react';
import CopyPhoneButton from './CopyPhoneButton';
import { useLanguage } from '@/hooks/useLanguage';
import { Order } from '@/types/common';

interface OrderCardProps {
  order: Order;
  onClick: () => void;
  onStatusChange: (id: string, status: Order['status']) => void;
  activeTab: 'active' | 'history' | 'analytics';
  loading: boolean;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onClick,
  onStatusChange,
  activeTab,
  loading
}) => {
  const { currentLanguage } = useLanguage();

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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} ТМ`;
  };

  // Находим следующий статус для заказа
  const getNextStatus = (currentStatus: Order['status']): Order['status'] | null => {
    switch (currentStatus) {
      case 'new':
      case 'pending':
        return 'confirmed';
      case 'confirmed':
        return 'preparing';
      case 'preparing':
        return 'ready';
      case 'ready':
        return 'delivered';
      default:
        return null;
    }
  };

  // Кнопка следующего статуса
  const nextStatus = getNextStatus(order.status);
  
  const getNextStatusButton = () => {
    if (!nextStatus) return null;

    let buttonText: string;
    let buttonColor: string;

    switch (nextStatus) {
      case 'confirmed':
        buttonText = currentLanguage === 'ru' ? 'Подтвердить' : 'Tassykla';
        buttonColor = 'bg-green-600 hover:bg-green-700';
        break;
      case 'preparing':
        buttonText = currentLanguage === 'ru' ? 'Готовить' : 'Taýýarla';
        buttonColor = 'bg-orange-600 hover:bg-orange-700';
        break;
      case 'ready':
        buttonText = currentLanguage === 'ru' ? 'Готово' : 'Taýýar';
        buttonColor = 'bg-blue-600 hover:bg-blue-700';
        break;
      case 'delivered':
        buttonText = currentLanguage === 'ru' ? 'Доставлено' : 'Eltip berildi';
        buttonColor = 'bg-purple-600 hover:bg-purple-700';
        break;
      default:
        buttonText = currentLanguage === 'ru' ? 'Далее' : 'Indiki';
        buttonColor = 'bg-blue-600 hover:bg-blue-700';
    }

    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onStatusChange(order.id, nextStatus);
        }}
        disabled={loading}
        className={`px-3 py-1.5 ${buttonColor} text-white text-sm rounded-md transition-colors disabled:opacity-50 flex-grow`}
      >
        {buttonText}
      </button>
    );
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      {/* Шапка карточки со статусом */}
      <div className={`px-4 py-2 flex items-center justify-between ${
        order.status === 'cancelled' ? 'bg-red-50 dark:bg-red-900/30' :
        order.status === 'delivered' || order.status === 'completed' ? 'bg-green-50 dark:bg-green-900/30' :
        'bg-blue-50 dark:bg-blue-900/30'
      }`}>
        <div className="flex items-center">
          <span className="text-sm font-medium mr-2">#{order.id.slice(-6)}</span>
          <span className={getStatusBadgeClass(order.status)}>
            {getStatusText(order.status)}
          </span>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          {formatDate(order.createdAt)}
        </div>
      </div>

      {/* Основное содержимое карточки */}
      <div className="px-4 py-3">
        {/* Информация о клиенте */}
        <div className="flex flex-col space-y-2 mb-3">
          <div className="flex items-start">
            <User className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5 mr-2" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {order.customerName}
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5 mr-2" />
            <div className="flex items-center">
              <p className="text-sm text-gray-700 dark:text-gray-300 mr-2">
                {order.customerPhone}
              </p>
              <CopyPhoneButton phone={order.customerPhone} />
            </div>
          </div>
          
          {order.customerAddress && (
            <div className="flex items-start">
              <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5 mr-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                {order.customerAddress}
              </p>
            </div>
          )}
        </div>

        {/* Состав заказа */}
        <div className="mb-3">
          <h4 className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 mb-2">
            {currentLanguage === 'ru' ? 'Состав заказа' : 'Sargyt düzümi'}
          </h4>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-md p-2">
            {order.items.slice(0, 2).map((item, index) => (
              <div key={index} className="flex justify-between py-1 text-sm">
                <div className="flex items-baseline">
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {item.quantity}×
                  </span>
                  <span className="ml-2 text-gray-700 dark:text-gray-300 line-clamp-1">
                    {currentLanguage === 'ru' ? item.dishName : item.dishNameTk}
                  </span>
                </div>
                <span className="text-gray-700 dark:text-gray-300">
                  {formatCurrency(item.total)}
                </span>
              </div>
            ))}
            
            {order.items.length > 2 && (
              <div className="text-xs text-blue-600 dark:text-blue-400 flex items-center justify-center mt-1">
                <span className="mr-1">
                  +{order.items.length - 2} {currentLanguage === 'ru' ? 'еще' : 'has-da'}
                </span>
                <ChevronRight className="w-3 h-3" />
              </div>
            )}
          </div>
        </div>

        {/* Итоговая сумма и кнопки управления */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Package className="w-4 h-4 mr-1" />
              <span className="text-xs">
                {order.items.length} {currentLanguage === 'ru' ? 'позиций' : 'pozisiýa'}
              </span>
            </div>
            <p className="font-bold text-gray-900 dark:text-white">
              {formatCurrency(order.totalAmount)}
            </p>
          </div>
          
          {/* Кнопки действий для активных заказов */}
          {activeTab === 'active' && (
            <div className="flex gap-2">
              {getNextStatusButton()}
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange(order.id, 'cancelled');
                }}
                disabled={loading}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors disabled:opacity-50"
              >
                {currentLanguage === 'ru' ? 'Отменить' : 'Ýatyr'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;