import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const Banner = () => {
  const [bannerText, setBannerText] = useState('🎉 50% OFF ON ALL PRODUCTS! FREE SHIPPING ON ORDERS ABOVE ₹999 🎉')

  // In a real app, this would be fetched from admin panel
  useEffect(() => {
    const savedBanner = localStorage.getItem('asurwears_banner')
    if (savedBanner) {
      setBannerText(savedBanner)
    }
  }, [])

  return (
    <div className="bg-gradient-to-r from-primary to-secondary text-primary-content overflow-hidden">
      <div className="relative">
        <motion.div
          className="whitespace-nowrap py-2 text-center font-semibold"
          animate={{
            x: ['100%', '-100%']
          }}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop"
          }}
        >
          <span className="inline-block px-4">
            {bannerText}
          </span>
        </motion.div>
      </div>
    </div>
  )
}

export default Banner 