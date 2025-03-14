"use client"

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ProductImageProps {
  src: string
  alt: string
  priority?: boolean
  className?: string
  aspectRatio?: 'square' | 'portrait' | 'landscape'
  width?: number
  height?: number
  fill?: boolean
  sizes?: string
}

export function ProductImage({
  src,
  alt,
  priority = false,
  className,
  aspectRatio = 'square',
  width,
  height,
  fill = true,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  ...props
}: ProductImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  // Определяем соотношение сторон
  const aspectRatioClass = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
  }

  // Обработчик ошибки загрузки изображения
  const handleError = () => {
    setError(true)
    setIsLoading(false)
  }

  // Если произошла ошибка, показываем заглушку
  if (error) {
    return (
      <div 
        className={cn(
          'bg-gray-100 flex items-center justify-center w-full',
          aspectRatioClass[aspectRatio],
          className
        )}
        style={{ position: 'relative', overflow: 'hidden' }}
        {...props}
      >
        <div className="text-gray-400 text-sm text-center p-4">
          Изображение недоступно
        </div>
      </div>
    )
  }

  return (
    <div 
      className={cn(
        'bg-gray-100 overflow-hidden w-full',
        aspectRatioClass[aspectRatio],
        className
      )}
      style={{ position: 'relative' }}
      {...props}
    >
      {/* Блюр-плейсхолдер, который исчезает после загрузки */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        priority={priority}
        sizes={sizes}
        className={cn(
          'object-cover w-full h-full duration-700 ease-in-out',
          isLoading ? 'scale-110 blur-lg grayscale' : 'scale-100 blur-0 grayscale-0'
        )}
        onLoadingComplete={() => setIsLoading(false)}
        onError={handleError}
      />
    </div>
  )
} 