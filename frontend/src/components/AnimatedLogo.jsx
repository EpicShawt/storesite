import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const AnimatedLogo = () => {
  const [currentText, setCurrentText] = useState('Asiur Wear')
  const [isRotating, setIsRotating] = useState(false)

  useEffect(() => {
    const textSequence = [
      { text: "Asiur Wear", delay: 2000 },
      { text: "Mythically Vibey", delay: 2000 },
      { text: "Asiur Wear", delay: 2000 },
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

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Animated W Logo */}
      <motion.div
        className="text-6xl font-bold text-white mb-4"
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
      <AnimatePresence mode="wait">
        {currentText && (
          <motion.div
            key={currentText}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="text-2xl font-semibold text-white"
          >
            {currentText}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AnimatedLogo 