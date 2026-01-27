import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";

import CategoryCard from "./CategoryCard";
import { categoryData } from "./categoryData";

const CategoriesSlider = () => {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 relative">
      
      {/* Header */}
      <div className="mb-8">
        <span className="inline-block bg-orange-500 text-white text-xs px-3 py-1 rounded-full mb-2">
          Shop By
        </span>
        <h2 className="text-3xl font-bold">Categories</h2>
      </div>

      {/* LEFT ARROW */}
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        className="absolute left-0 bottom-21 translate-y-[-45%] z-20
           w-10 h-10 bg-white rounded-xl shadow-md
           flex items-center justify-center hover:bg-gray-100"
      >
        ‹
      </button>

      {/* RIGHT ARROW */}
      <button
        onClick={() => swiperRef.current?.slideNext()}
        className="absolute right-0 bottom-21 translate-y-[-45%] z-20
           w-10 h-10 bg-white rounded-xl shadow-md
           flex items-center justify-center hover:bg-gray-100"
      >
        ›
      </button>

      {/* SLIDER */}
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        spaceBetween={20}
        slidesPerView={6}
        breakpoints={{
          0: { slidesPerView: 2 },
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 6 },
        }}
      >
        {categoryData.map((item) => (
          <SwiperSlide key={item.id}>
            <CategoryCard item={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default CategoriesSlider;
