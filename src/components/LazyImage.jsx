import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

function LazyImage({ 
  src, 
  alt = '', 
  className = '', 
  placeholder = 'https://neeko-copilot.bytedance.net/api/text2image?prompt=abstract%20gradient%20placeholder%20background&image_size=square',
  aspectRatio = '16/9',
  lazy = true 
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

    // 创建 IntersectionObserver
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
        rootMargin: '100px', // 提前 100px 加载
        threshold: 0.1
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

  const handleError = () => {
    // 加载失败时显示占位图
    setIsLoaded(true)
  }

  // 根据宽高比设置 padding-bottom
  const getAspectRatioStyle = () => {
    const [width, height] = aspectRatio.split('/').map(Number)
    return {
      paddingBottom: `${(height / width) * 100}%`
    }
  }

  return (
    <motion.div
      ref={imgRef}
      className={`relative overflow-hidden bg-notion-gray ${className}`}
      style={getAspectRatioStyle()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* 占位图 */}
      <motion.img
        src={placeholder}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'blur(8px)' }}
        animate={{ opacity: isLoaded ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* 实际图片 */}
      {isInView && (
        <motion.img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 1.1 }}
          transition={{ duration: 0.5 }}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}

      {/* 加载指示器 */}
      {isInView && !isLoaded && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      )}
    </motion.div>
  )
}

export default LazyImage