import type { FeaturedItem } from "./featuredData";
import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";

type Props = {
  item: FeaturedItem;
};

const FeaturedCard = ({ item }: Props) => {
  const [qty, setQty] = useState(1);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 relative">

      {/* Discount */}
      <span className="absolute top-4 left-4 bg-orange-500 text-white text-xs px-3 py-1 rounded-md">
        {item.discount}
      </span>

      {/* Wishlist */}
      <button className="absolute top-4 right-4 bg-orange-100 p-2 rounded-full">
        <Heart size={16} className="text-orange-500" />
      </button>

      {/* Image */}
      <div className="flex justify-center mt-6 mb-4 hover:scale-110 transition-transform duration-500 ease out">
        <img
          src={item.image}
          alt={item.title}
          className="w-36 h-36 object-contain"
        />
      </div>

      {/* Stock */}
      <p className="text-xs text-gray-400 text-center mb-1">
        Available (In Stock)
      </p>

      {/* Title */}
      <h3 className="text-sm font-semibold text-center mb-3">
        {item.title}
      </h3>

      {/* Price */}
      <div className="flex justify-center items-center gap-2 mb-4">
        <span className="text-orange-500 font-bold text-lg">
          ₹{item.price}
        </span>
        <span className="text-gray-400 line-through text-sm">
          ₹{item.oldPrice}
        </span>
      </div>

      {/* Quantity + Cart */}
      <div className="flex justify-between items-center ">
        <div className="flex items-center gap-2 ">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="bg-gray-800 text-white w-8 h-8 rounded3 flex items-center justify-center"
          >
            <Minus size={14} />
          </button>

          <span className="w-6 text-center">{qty}</span>

          <button
            onClick={() => setQty(qty + 1)}
            className="bg-gray-800 text-white w-8 h-8 rounded flex items-center justify-center"
          >
            <Plus size={14} />
          </button>
        </div>

        <ShoppingCart className="text-gray-300" size={20} />
      </div>
    </div>
  );
};

export default FeaturedCard;
