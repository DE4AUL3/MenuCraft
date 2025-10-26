import { useEffect, useRef } from 'react';

// Путь к звуковому файлу (можно заменить на свой)
const SOUND_URL = '/sounds/new-order.mp3';

// Функция для показа браузерного уведомления
function showNotification(title: string, body: string) {
  if (window.Notification && Notification.permission === 'granted') {
    new Notification(title, { body });
  }
}

// Функция для воспроизведения звука
function playSound(audioRef: React.RefObject<HTMLAudioElement | null>) {
  if (audioRef.current) {
    audioRef.current.currentTime = 0;
    audioRef.current.play();
  }
}

// Получение новых заказов через polling (пример, заменить на WebSocket при необходимости)
async function fetchNewOrders(lastOrderId: string | null) {
  const res = await fetch('/api/admin/orders?after=' + (lastOrderId || ''));
  if (!res.ok) return [];
  return res.json();
}

export default function AdminOrderNotifier({ setOrdersCount }: { setOrdersCount?: (count: number) => void }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const prevOrderIds = useRef<string[]>([]);

  useEffect(() => {
    if (window.Notification && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let isMounted = true;

    async function poll() {
      try {
        const res = await fetch('/api/order');
        if (!res.ok) return;
        const orders = await res.json();
        if (!Array.isArray(orders)) return;

        // Сравниваем id заказов, чтобы определить новые
        const newIds = orders.map((o: any) => o.id);
        const prevIds = prevOrderIds.current;
        if (prevIds.length && newIds[0] && !prevIds.includes(newIds[0])) {
          // Новый заказ
          showNotification('Новый заказ', `Заказ №${orders[0].id}`);
          playSound(audioRef);
        }
        prevOrderIds.current = newIds;
      } catch {}
    }

    // Первый запуск — получить все id
    (async () => {
      try {
        const res = await fetch('/api/order');
        if (!res.ok) return;
        const orders = await res.json();
        if (!Array.isArray(orders)) return;
        prevOrderIds.current = orders.map((o: any) => o.id);
      } catch {}
    })();

    interval = setInterval(() => {
      if (isMounted) poll();
    }, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [setOrdersCount]);

  return (
    <audio ref={audioRef} src={SOUND_URL} preload="auto" style={{ display: 'none' }} />
  );
}
