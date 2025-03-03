"use client"

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

interface RotatingBackgroundProps {
  images: string[]
  interval?: number
  className?: string
  overlayClassName?: string
}

export default function RotatingBackground({
  images,
  interval = 7000,
  className = "",
  overlayClassName = ""
}: RotatingBackgroundProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [nextIndex, setNextIndex] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [loadedImages, setLoadedImages] = useState<string[]>([])
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Предварительная загрузка изображений
  useEffect(() => {
    if (images.length <= 1) return
    
    console.log('Предзагружаем изображения:', images)
    
    // Предзагружаем все изображения
    const preloadedImages: string[] = []
    images.forEach(src => {
      const imgElement = document.createElement('img')
      imgElement.src = src
      imgElement.onload = () => {
        console.log('Изображение загружено успешно:', src)
        preloadedImages.push(src)
        if (preloadedImages.length === images.length) {
          console.log('Все изображения загружены:', preloadedImages)
          setLoadedImages(preloadedImages)
        }
      }
      imgElement.onerror = () => {
        console.error('Ошибка загрузки изображения:', src)
      }
    })
  }, [images])

  useEffect(() => {
    // Если нет изображений или только одно изображение, не нужно менять
    if (images.length <= 1) return

    const timer = setInterval(() => {
      // Начинаем переход
      setIsTransitioning(true)
      
      // Устанавливаем следующий индекс
      const next = (currentIndex + 1) % images.length
      setNextIndex(next)
      
      // Задержка для завершения анимации
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex(next)
        setIsTransitioning(false)
      }, 1500) // Увеличиваем время перехода до 1.5 секунд для плавности
    }, interval)
    
    return () => {
      clearInterval(timer)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [currentIndex, images.length, interval])

  // Если нет изображений, ничего не рендерим
  if (images.length === 0) {
    console.warn('RotatingBackground: не переданы изображения')
    return null
  }

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Текущее изображение */}
      <div className="absolute inset-0 transition-opacity duration-1500 ease-in-out"
           style={{ opacity: isTransitioning ? 0 : 1 }}>
        <Image 
          src={images[currentIndex]}
          alt="Фоновое изображение"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
          quality={90}
          onError={() => console.error('Ошибка загрузки изображения', images[currentIndex])}
        />
        {overlayClassName && <div className={`absolute inset-0 ${overlayClassName}`}></div>}
      </div>
      
      {/* Следующее изображение (появляется плавно) */}
      <div className="absolute inset-0 transition-opacity duration-1500 ease-in-out"
           style={{ opacity: isTransitioning ? 1 : 0 }}>
        <Image 
          src={images[nextIndex]}
          alt="Следующее фоновое изображение"
          fill
          className="object-cover object-center"
          sizes="100vw"
          quality={90}
          onError={() => console.error('Ошибка загрузки изображения', images[nextIndex])}
        />
        {overlayClassName && <div className={`absolute inset-0 ${overlayClassName}`}></div>}
      </div>
    </div>
  )
} 