import type { CategoryItem } from "./categoryData";

type Props = {
  item: CategoryItem;
};

const CategoryCard = ({ item }: Props) => {
  return (
    <div className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition cursor-pointer">
      <img
        src={item.image}
        alt={item.name}
        className="w-16 h-16 object-contain mb-4"
      />
      <p className="text-sm font-medium text-gray-800 text-center">
        {item.name}
      </p>
    </div>
  );
};

export default CategoryCard;
