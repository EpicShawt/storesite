import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const AnimatedLogo = ({ size = 'large', showText = true }) => {
  const [currentText, setCurrentText] = useState('Asur Wear')
  const [isRotating, setIsRotating] = useState(false)

  useEffect(() => {
    const textSequence = [
      { text: "Asur Wear", delay: 2000 },
      { text: "Mythically Vibey", delay: 2000 },
      { text: "Asur Wear", delay: 2000 },
      { text: "Mythically Vibey", delay: 2000 }
    ]

    let currentIndex = 0
    let timeoutId

    const animateText = () => {
      const { text, delay } = textSequence[currentIndex]
      
      setIsRotating(true)
      
      setTimeout(() => {
        setCurrentText('')
        
        setTimeout(() => {
          setCurrentText(text)
          
          setTimeout(() => {
            setIsRotating(false)
          }, 500)
        }, 500)
      }, 1000)
      
      timeoutId = setTimeout(() => {
        currentIndex = (currentIndex + 1) % textSequence.length
        animateText()
      }, delay)
    }

    timeoutId = setTimeout(animateText, 1000)

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  // Size configurations
  const sizeConfig = {
    small: {
      logoSize: 'text-lg',
      textSize: 'text-xs',
      containerClass: 'flex flex-col items-center'
    },
    medium: {
      logoSize: 'text-3xl',
      textSize: 'text-sm',
      containerClass: 'flex flex-col items-center'
    },
    large: {
      logoSize: 'text-6xl',
      textSize: 'text-2xl',
      containerClass: 'flex flex-col items-center justify-center'
    }
  }

  const config = sizeConfig[size]

  return (
    <div className={config.containerClass}>
      {/* Animated W Logo */}
      <motion.div
        className={`${config.logoSize} font-bold text-white ${size === 'large' ? 'mb-4' : 'mb-1'}`}
        animate={{
          rotate: 360
        }}
        transition={{
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop"
        }}
        style={{
          transformOrigin: "center center"
        }}
      >
        W
      </motion.div>

      {/* Animated Text */}
      {showText && (
        <AnimatePresence mode="wait">
          {currentText && (
            <motion.div
              key={currentText}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className={`${config.textSize} font-semibold text-white`}
            >
              {currentText}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}

export default AnimatedLogo 