import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

function ResponsiveImage({
  src,
  srcSet,
  sizes,
  alt = '',
  className = '',
  aspectRatio = '16/9',
  lazy = true,
  placeholderColor = '#2d2d2d'
}) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(!lazy)
  const imgRef = useRef(null)
  const observerRef = useRef(null)

  useEffect(() => {
    if (!lazy) {
      setIsInView(true)
      return
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observerRef.current?.unobserve(entry.target)
          }
        })
      },
      {
        rootMargin: '200px',
        threshold: 0.05
      }
    )

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current)
    }

    return () => {
      observerRef.current?.disconnect()
    }
  }, [lazy])

  const handleLoad = () => {
    setIsLoaded(true)
  }

  const [width, height] = aspectRatio.split('/').map(Number)

  return (
    <motion.div
      ref={imgRef}
      className={`relative overflow-hidden bg-${placeholderColor} ${className}`}
      style={{ paddingBottom: `${(height / width) * 100}%` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* 骨架屏/占位图 */}
      <motion.div
        className="absolute inset-0"
        style={{ backgroundColor: placeholderColor }}
        animate={{ opacity: isLoaded ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* 渐进式加载占位图 */}
      {isInView && !isLoaded && (
        <motion.img
          src={src}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter: 'blur(20px)',
            transform: 'scale(1.1)'
          }}
          animate={{ opacity: isLoaded ? 0 : 1 }}
          transition={{ duration: 0.4 }}
          onLoad={() => {}}
        />
      )}

      {/* 实际图片 */}
      {isInView && (
        <motion.img
          ref={imgRef}
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
          loading={lazy ? 'lazy' : 'eager'}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 1.05 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          onLoad={handleLoad}
        />
      )}
    </motion.div>
  )
}

export default ResponsiveImage