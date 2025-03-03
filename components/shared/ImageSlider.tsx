"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade } from 'swiper/modules'
import { getLocalImageUrl } from '@/lib/image-utils'

// Стили импортируются глобально в app/layout.tsx

interface ImageSliderProps {
  images: string[]
  interval?: number
  effect?: 'fade' | 'slide'
  className?: string
  overlayClassName?: string
  fallbackImage?: string
}

export default function ImageSlider({
  images,
  interval = 5000,
  effect = 'fade',
  className = "",
  overlayClassName = "",
  fallbackImage = "/images/sushi-background-1.jpg"
}: ImageSliderProps) {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  
  // Получаем массив доступных изображений, преобразуя пути в локальные URL
  const availableImages = images
    .map(getLocalImageUrl)
    .filter(src => !failedImages.has(src));
  
  // Если нет доступных изображений, используем запасное
  const imagesToUse = availableImages.length > 0 
    ? availableImages 
    : [getLocalImageUrl(fallbackImage)];
  
  // Обработчик ошибок загрузки изображений
  const handleImageError = (src: string) => {
    console.warn(`Ошибка загрузки изображения: ${src}`);
    setFailedImages(prev => {
      const newSet = new Set(prev);
      newSet.add(src);
      return newSet;
    });
  };

  return (
    <div className="relative w-full h-full bg-gray-800" style={{ minHeight: '400px' }}>
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect={effect === 'fade' ? 'fade' : undefined}
        autoplay={{
          delay: interval,
          disableOnInteraction: false,
          pauseOnMouseEnter: false
        }}
        speed={1000}
        loop={true}
        slidesPerView={1}
        className="h-full w-full"
      >
        {imagesToUse.map((src, index) => (
          <SwiperSlide key={index} className="h-full w-full">
            <div className="relative w-full h-full" style={{ aspectRatio: '16/9' }}>
              <Image
                src={src}
                alt={`Слайд ${index + 1}`}
                fill
                priority={index === 0}
                className="object-cover object-center"
                sizes="100vw"
                quality={85}
                onError={() => {
                  handleImageError(src);
                  // Обработка ошибки происходит на уровне компонента
                  // через изменение состояния failedImages и фильтрацию
                }}
              />
              {overlayClassName && <div className={`absolute inset-0 ${overlayClassName}`}></div>}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
} 