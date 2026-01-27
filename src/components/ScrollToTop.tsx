import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant', // or 'smooth' if you like
      behavior: 'smooth', // or 'smooth' if you like
    })
  }, [pathname])

  return null
}

export default ScrollToTop
