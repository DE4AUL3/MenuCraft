// Простая база данных в localStorage для номеров телефонов
export interface PhoneRecord {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: string;
  createdAt: string;
  orders: string[]; // ID заказов
}

export interface Order {
  id: string;
  phone: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  createdAt: string;
  customerInfo?: {
    name?: string;
    email?: string;
    address?: string;
    notes?: string;
  };
}

class DatabaseService {
  private readonly PHONES_KEY = 'cafe_phone_database';
  private readonly ORDERS_KEY = 'cafe_orders_database';

  // Получить все номера телефонов
  getPhoneRecords(): PhoneRecord[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(this.PHONES_KEY);
    return data ? JSON.parse(data) : [];
  }

  // Сохранить номера телефонов
  savePhoneRecords(records: PhoneRecord[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.PHONES_KEY, JSON.stringify(records));
  }

  // Добавить или обновить номер телефона
  addPhoneRecord(
    phone: string,
    orderTotal: number,
    orderId: string,
    customerInfo?: { name?: string; email?: string }
  ): void {
    const records = this.getPhoneRecords();
    const existingIndex = records.findIndex(r => r.phone === phone);

    if (existingIndex >= 0) {
      // Обновляем существующую запись
      records[existingIndex].orderCount += 1;
      records[existingIndex].totalSpent += orderTotal;
      records[existingIndex].lastOrderDate = new Date().toISOString();
      records[existingIndex].orders.push(orderId);
      if (customerInfo?.name) records[existingIndex].name = customerInfo.name;
      if (customerInfo?.email) records[existingIndex].email = customerInfo.email;
    } else {
      // Создаем новую запись
      const newRecord: PhoneRecord = {
        id: Date.now().toString(),
        phone,
        name: customerInfo?.name,
        email: customerInfo?.email,
        orderCount: 1,
        totalSpent: orderTotal,
        lastOrderDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        orders: [orderId]
      };
      records.push(newRecord);
    }

    this.savePhoneRecords(records);
  }

  // Получить все заказы
  getOrders(): Order[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(this.ORDERS_KEY);
    return data ? JSON.parse(data) : [];
  }

  // Сохранить заказы
  saveOrders(orders: Order[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders));
  }

  // Создать новый заказ
  createOrder(
    phone: string,
    items: Array<{ id: string; name: string; price: number; quantity: number }>,
    customerInfo?: { name?: string; email?: string; address?: string; notes?: string }
  ): string {
    const orders = this.getOrders();
    const orderId = Date.now().toString();
    
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const newOrder: Order = {
      id: orderId,
      phone,
      items,
      total,
      status: 'pending',
      createdAt: new Date().toISOString(),
      customerInfo
    };

    orders.push(newOrder);
    this.saveOrders(orders);

    // Добавляем/обновляем номер телефона
    this.addPhoneRecord(phone, total, orderId, customerInfo);

    return orderId;
  }

  // Обновить статус заказа
  updateOrderStatus(orderId: string, status: Order['status']): void {
    const orders = this.getOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex >= 0) {
      orders[orderIndex].status = status;
      this.saveOrders(orders);
    }
  }

  // Получить статистику
  getStatistics() {
    const records = this.getPhoneRecords();
    const orders = this.getOrders();

    return {
      totalCustomers: records.length,
      totalOrders: orders.length,
      totalRevenue: records.reduce((sum, r) => sum + r.totalSpent, 0),
      averageOrderValue: orders.length > 0 ? 
        orders.reduce((sum, o) => sum + o.total, 0) / orders.length : 0,
      recentCustomers: records
        .sort((a, b) => new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime())
        .slice(0, 10)
    };
  }

  // Экспорт номеров для SMS-рассылки
  exportPhoneNumbers(): string {
    const records = this.getPhoneRecords();
    return records.map(r => r.phone).join('\n');
  }

  // Очистить базу данных
  clearDatabase(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.PHONES_KEY);
    localStorage.removeItem(this.ORDERS_KEY);
  }
}

export const db = new DatabaseService();