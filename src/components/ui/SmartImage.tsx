'use client';

import Image from 'next/image';
import { useState } from 'react';
import { imageService } from '@/lib/imageService';

interface SmartImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export default function SmartImage({ 
  src, 
  alt, 
  fill, 
  width, 
  height, 
  className, 
  sizes, 
  priority,
  placeholder,
  blurDataURL
}: SmartImageProps) {
  const [imageError, setImageError] = useState(false);
  
  // Получаем URL изображения через imageService
  const imageUrl = imageService.getImageUrl(src);
  
  // Если это локальное base64 изображение или blob-ссылка, используем обычный img
  if (imageUrl.startsWith('data:') || imageUrl.startsWith('blob:')) {
    // Для blob обязательно width/height (или 100%)
    const imgStyle = fill
      ? { width: '100%', height: '100%' } as React.CSSProperties
      : { width: width || 200, height: height || 200 } as React.CSSProperties;
    return (
      <img
        src={imageUrl}
        alt={alt}
        className={className}
        style={imgStyle}
        width={width || 200}
        height={height || 200}
        onError={() => setImageError(true)}
      />
    );
  }
  
  // Если это внешний URL или placeholder, используем next/Image
  return (
    <Image
      src={imageError ? '/images/placeholder.svg' : imageUrl}
      alt={alt}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      className={className}
      sizes={sizes}
      priority={priority}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      onError={() => setImageError(true)}
    />
  );
}