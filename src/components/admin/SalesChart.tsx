"use client";

import React from 'react';

// Интерфейс для входных данных графика продаж
interface SalesChartProps {
  data: { date: string; value: number }[];
  theme: string;
}

const SalesChart: React.FC<SalesChartProps> = ({ data, theme }) => {
  const maxValue = data && data.length ? Math.max(...data.map(item => item.value)) : 0;

  return (
    <div className="p-4">
      <h4 className="text-lg font-bold mb-2">График продаж</h4>
      {(!data || data.length === 0) ? (
        <div className="text-center py-8">Нет данных для отображения графика</div>
      ) : (
        <div className="flex flex-col">
          <div className="flex items-end space-x-2 h-48 border-l-2 border-b-2">
            {data.map((item, index) => {
              const barHeight = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
              return (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`transition-all duration-300 ${theme === 'dark' ? 'bg-blue-700' : 'bg-blue-500'}`}
                    style={{ height: `${barHeight}%`, width: '20px' }}
                    title={`${item.date}: ${item.value}`}
                  />
                  <div className="text-xs mt-2 text-gray-500">{item.date.slice(5)}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesChart;
