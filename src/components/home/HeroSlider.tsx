import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import HeroSlide from "./HeroSlide";
import { heroData } from "./heroData";

const HeroSlider = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={20}
        slidesPerView={1.2}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        loop={true}
        breakpoints={{
          640: { slidesPerView: 1.5 },
          768: { slidesPerView: 2.2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {heroData.map((item) => (
          <SwiperSlide key={item.id}>
            <HeroSlide item={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroSlider;
