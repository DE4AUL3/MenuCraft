"use client";

import { useEffect, useMemo, useState } from "react";

export default function QRPage() {
  const [baseUrl, setBaseUrl] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
    }
  }, []);

  // По требованию: QR должен вести на страницу выбора ресторана
  const qrValue = useMemo(() => {
    return baseUrl ? `${baseUrl}/select-restaurant` : "";
  }, [baseUrl]);

  const qrImgUrl = useMemo(() => {
    if (!qrValue) return "";
    const size = 256;
    const data = encodeURIComponent(qrValue);
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${data}`;
  }, [qrValue]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(qrValue);
      alert("Ссылка скопирована в буфер обмена");
    } catch {}
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">QR → выбор ресторана</h1>

        <p className="text-gray-700 dark:text-gray-300 mb-4">
          При сканировании QR пользователь попадет на страницу выбора ресторана. Ниже — итоговая ссылка:
        </p>

        <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm break-all select-all mb-6">
          {qrValue || "Формируем ссылку..."}
        </div>

        {qrImgUrl && (
          <div className="mb-6">
            <div className="inline-block p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              {/* Рендерим QR-изображение без дополнительных зависимостей */}
              {/* Источник: api.qrserver.com */}
              <img src={qrImgUrl} alt="QR для /select-restaurant" width={256} height={256} />
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <a
            href={qrValue}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Открыть ссылку
          </a>
          <button onClick={copy} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white">
            Скопировать
          </button>
          {qrImgUrl && (
            <a
              href={qrImgUrl}
              download="menucraft-qrcode.png"
              className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white"
            >
              Скачать PNG
            </a>
          )}
        </div>

        <div className="mt-8 text-sm text-gray-600 dark:text-gray-400">
          Примечание: визуальную генерацию QR (SVG/PNG) добавим после установки зависимости. Сейчас важен корректный адрес — он ведет на <code>/select-restaurant</code>.
        </div>
      </div>
    </div>
  );
}
