import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";

import FeaturedCard from "./FeaturedCard";
import { featuredData } from "./featuredData";

const FeaturedSlider = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-14">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <span className="bg-orange-500 text-white text-xs px-3 py-1 rounded-md">
            For You
          </span>
          <h2 className="text-2xl font-bold mt-2">
            Top Featured Products
          </h2>
        </div>

        <a href="/products" className="text-sm text-gray-600 hover:text-black">
          See All
        </a>
      </div>

      {/* Slider */}
      <div className="relative">
        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: ".featured-prev",
            nextEl: ".featured-next",
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
          {featuredData.map((item) => (
            <SwiperSlide key={item.id}>
              <FeaturedCard item={item} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Buttons */}
        <button className="featured-prev absolute left-[-20px] top-1/2 -translate-y-1/2 bg-white shadow rounded-full w-10 h-10 flex items-center justify-center z-10">
          ‹
        </button>

        <button className="featured-next absolute right-[-20px] top-1/2 -translate-y-1/2 bg-white shadow rounded-full w-10 h-10 flex items-center justify-center z-10">
          ›
        </button>
      </div>
    </section>
  );
};

export default FeaturedSlider;
