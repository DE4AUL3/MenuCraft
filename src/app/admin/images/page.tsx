'use client';

import React from 'react';
import ImageManagerV2 from '@/components/admin/ImageManagerV2';

export default function ImagesPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Управление изображениями</h1>
      
      <div className="bg-white dark:bg-gray-900 shadow-sm rounded-lg p-6">
        <ImageManagerV2 
          title="Библиотека изображений"
          allowUpload={true}
        />
      </div>
    </div>
  );
}