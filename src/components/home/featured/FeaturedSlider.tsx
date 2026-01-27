// FeaturedSlider.tsx
import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'

import api from '../../../api/axios'
import type { Product } from '../../../types'
import FeaturedCard from './FeaturedCard'
import { Link } from 'react-router-dom'

const FeaturedSlider = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/products')
      .then(res => {
        // Take first 6 products as featured
        setProducts(res.data.slice(0, 6))
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading || products.length === 0) return null

  return (
    <section className="max-w-7xl mx-auto px-4 py-14">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <span className="bg-orange-500 text-white text-xs px-3 py-1 rounded-md">
            For You
          </span>
          <h2 className="text-2xl font-bold mt-2">
            Top Featured Products
          </h2>
        </div>

        <Link
          to="/products"
          className="text-sm text-gray-600 hover:text-black"
        >
          See All
        </Link>
      </div>

      {/* SLIDER WRAPPER */}
      <div className="relative">
        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: '.featured-prev',
            nextEl: '.featured-next',
          }}
          spaceBetween={24}
          slidesPerView={5}
          breakpoints={{
            0: { slidesPerView: 1.2 },
            640: { slidesPerView: 2.2 },
            1024: { slidesPerView: 4.2 },
            1280: { slidesPerView: 5 },
          }}
        >
          {products.map(product => (
            <SwiperSlide key={product.id}>
              <FeaturedCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* LEFT ARROW */}
        <button
          className="featured-prev absolute -left-5 top-1/2 -translate-y-1/2
                     bg-white shadow-md rounded-full w-10 h-10
                     flex items-center justify-center z-10
                     hover:scale-105 transition"
          aria-label="Previous"
        >
          ‹
        </button>

        {/* RIGHT ARROW */}
        <button
          className="featured-next absolute -right-5 top-1/2 -translate-y-1/2
                     bg-white shadow-md rounded-full w-10 h-10
                     flex items-center justify-center z-10
                     hover:scale-105 transition"
          aria-label="Next"
        >
          ›
        </button>
      </div>
    </section>
  )
}

export default FeaturedSlider