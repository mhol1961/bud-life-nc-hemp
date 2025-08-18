import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface CarouselItem {
  id: string
  title: string
  subtitle?: string
  description?: string
  backgroundImage?: string
  backgroundColor?: string
  textColor?: string
}

interface ImageCarouselProps {
  items: CarouselItem[]
  autoPlay?: boolean
  interval?: number
  showIndicators?: boolean
  showArrows?: boolean
  height?: string
  className?: string
}

export function ImageCarousel({
  items,
  autoPlay = true,
  interval = 6000,
  showIndicators = true,
  showArrows = true,
  height = 'h-[600px]',
  className = ''
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isUserInteracting, setIsUserInteracting] = useState(false)

  // Robust auto-play with improved timer management
  useEffect(() => {
    // Only auto-advance if autoPlay is enabled, not paused, not user interacting, and has multiple items
    if (!autoPlay || isPaused || isUserInteracting || items.length <= 1) {
      return
    }
    
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % items.length
        console.log(`Auto-advancing carousel: slide ${prevIndex + 1} -> slide ${nextIndex + 1}`)
        return nextIndex
      })
    }, interval)

    console.log(`Carousel auto-play active with ${interval}ms interval`)
    return () => {
      clearInterval(timer)
      console.log('Carousel auto-play timer cleared')
    }
  }, [autoPlay, isPaused, isUserInteracting, interval, items.length, currentIndex])

  // Reset user interaction flag after a delay
  useEffect(() => {
    if (!isUserInteracting) return
    
    const resetTimer = setTimeout(() => {
      setIsUserInteracting(false)
      console.log('Resuming auto-play after user interaction')
    }, 3000) // Resume auto-play 3 seconds after user interaction
    
    return () => clearTimeout(resetTimer)
  }, [isUserInteracting])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsUserInteracting(true)
    console.log(`User navigated to slide ${index + 1}`)
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex - 1 + items.length) % items.length
      console.log(`User navigated to previous slide: ${newIndex + 1}`)
      return newIndex
    })
    setIsUserInteracting(true)
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % items.length
      console.log(`User navigated to next slide: ${newIndex + 1}`)
      return newIndex
    })
    setIsUserInteracting(true)
  }

  if (!items.length) return null

  return (
    <div 
      className={`relative overflow-hidden ${height} ${className}`}
      onMouseEnter={() => {
        setIsPaused(true)
        console.log('Carousel paused on mouse enter')
      }}
      onMouseLeave={() => {
        setIsPaused(false)
        console.log('Carousel resumed on mouse leave')
      }}
    >
      {/* Carousel Items */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className={`absolute inset-0 flex items-center justify-center ${height}`}
          style={{
            backgroundImage: items[currentIndex].backgroundImage 
              ? `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.3)), url(${items[currentIndex].backgroundImage})`
              : undefined,
            backgroundColor: items[currentIndex].backgroundColor || '#1f2937',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="text-center px-6 max-w-4xl mx-auto z-10">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className={`text-4xl lg:text-6xl font-bold mb-4 ${items[currentIndex].textColor || 'text-white'}`}
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
            >
              {items[currentIndex].title}
            </motion.h2>
            
            {items[currentIndex].subtitle && (
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className={`text-xl lg:text-2xl mb-6 ${items[currentIndex].textColor || 'text-white'} opacity-90`}
                style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
              >
                {items[currentIndex].subtitle}
              </motion.p>
            )}
            
            {items[currentIndex].description && (
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className={`text-lg ${items[currentIndex].textColor || 'text-white'} opacity-80 max-w-2xl mx-auto`}
                style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
              >
                {items[currentIndex].description}
              </motion.p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {showArrows && items.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-200 hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-200 hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && items.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-white scale-125 shadow-lg' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Scrolling Message Banner Component
interface ScrollingMessage {
  id: string
  text: string
  icon?: React.ComponentType<{ className?: string }>
}

interface ScrollingBannerProps {
  messages: ScrollingMessage[]
  speed?: number
  backgroundColor?: string
  textColor?: string
  height?: string
}

export function ScrollingBanner({
  messages,
  speed = 50,
  backgroundColor = 'bg-emerald-600',
  textColor = 'text-white',
  height = 'h-12'
}: ScrollingBannerProps) {
  return (
    <div className={`${backgroundColor} ${height} overflow-hidden relative flex items-center`}>
      <div 
        className="flex items-center whitespace-nowrap"
        style={{
          animation: `marquee ${speed}s linear infinite`,
        }}
      >
        {[...messages, ...messages].map((message, index) => (
          <div key={`${message.id}-${index}`} className={`flex items-center ${textColor} mx-8`}>
            {message.icon && <message.icon className="w-4 h-4 mr-2" />}
            <span className="font-medium">{message.text}</span>
            <span className="mx-8 opacity-50">•</span>
          </div>
        ))}
      </div>
      
      {/* Global CSS for keyframes - will be handled by Tailwind */}
    </div>
  )
}
