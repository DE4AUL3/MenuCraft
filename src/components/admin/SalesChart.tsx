"use client";

import React from 'react';

// Интерфейс для входных данных графика продаж
interface SalesChartProps {
  data: { date: string; value: number }[];
  theme: string;
}

const SalesChart: React.FC<SalesChartProps> = ({ data, theme }) => {
  if (!data || data.length === 0) {
    return <div className="text-center">Нет данных для отображения графика</div>;
  }

  // Определяем максимальное значение для масштабирования столбцов
  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <div className="p-4">
      <h4 className="text-lg font-bold mb-2">График продаж</h4>
      <div className="flex items-end space-x-2 h-48 border-l-2 border-b-2">
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * 100;
          return (
            <div
              key={index}
              className={`bg-blue-500 transition-all duration-300 ${theme === 'dark' ? 'bg-blue-700' : 'bg-blue-500'}`}
              style={{ height: `${barHeight}%`, width: '20px' }}
              title={`${item.date}: ${item.value}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SalesChart;
