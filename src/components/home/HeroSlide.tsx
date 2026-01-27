import { Link } from "react-router-dom";
import type { HeroItem } from "./heroData";

type Props = {
  item: HeroItem;
};

const HeroSlide = ({ item }: Props) => {
  return (
    <div
      className="relative h-[260px] rounded-2xl overflow-hidden"
      style={{
        backgroundImage: `url(${item.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 text-white">
        <span className="text-orange-400 font-semibold mb-2">
          {item.discount}
        </span>

        <h3 className="text-xl font-bold mb-1">
          {item.title}
        </h3>

        <p className="text-sm text-gray-200 mb-4">
          {item.subtitle}
        </p>

        <Link
          to="/products"
          className="bg-green-700 hover:bg-green-800 w-fit px-6 py-2 rounded-md text-sm font-medium"
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
};

export default HeroSlide;
