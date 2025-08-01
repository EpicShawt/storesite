import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const AnimatedLogo = () => {
  const [currentText, setCurrentText] = useState('')
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    const textSequence = [
      { text: "Asur Wears", delay: 1000 },
      { text: "Mythically Vibey", delay: 2000 },
      { text: "Asur Wears", delay: 1000 },
      { text: "Mythically Vibey", delay: 2000 }
    ]

    let currentIndex = 0
    let timeoutId

    const animateText = () => {
      const { text, delay } = textSequence[currentIndex]
      
      // Fade out current text
      setCurrentText('')
      
      setTimeout(() => {
        // Set new text
        setCurrentText(text)
        
        // Schedule next animation
        timeoutId = setTimeout(() => {
          currentIndex = (currentIndex + 1) % textSequence.length
          animateText()
        }, delay)
      }, 500)
    }

    // Start animation after initial delay
    timeoutId = setTimeout(animateText, 1000)

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Animated W Logo */}
      <motion.div
        className="text-6xl font-bold text-primary mb-4"
        animate={{
          rotate: [-15, 15, -15]
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse"
        }}
        style={{
          transformOrigin: "center bottom"
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
            className="text-2xl font-semibold text-gradient"
          >
            {currentText}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AnimatedLogo 