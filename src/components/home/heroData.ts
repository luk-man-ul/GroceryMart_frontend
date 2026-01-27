import fruits from "../../assets/home/hero/fruits.jpeg";
import egg from "../../assets/home/hero/egg.jpeg";
import beverages from "../../assets/home/hero/beverages.jpeg";
import vegetables from "../../assets/home/hero/vegetables.jpeg";
import nuts from "../../assets/home/hero/nuts.jpeg";

export type HeroItem = {
  id: number;
  discount: string;
  title: string;
  subtitle: string;
  image: string;
};

export const heroData: HeroItem[] = [
  {
    id: 1,
    discount: "5% OFF",
    title: "Buy More & Save More",
    subtitle: "Fresh Fruits",
    image: fruits,
  },
  {
    id: 2,
    discount: "3% OFF",
    title: "Hot Deals on New Items",
    subtitle: "Daily Essentials Eggs & Dairy",
    image: egg,
  },
  {
    id: 3,
    discount: "2% OFF",
    title: "Buy More & Save More",
    subtitle: "Beverages",
    image: beverages,
  },
  {
    id: 4,
    discount: "4% OFF",
    title: "Fresh & Healthy",
    subtitle: "Vegetables",
    image: vegetables,
  },
  {
    id: 5,
    discount: "3% OFF",
    title: "Buy More & Save More",
    subtitle: "Nuts & Snacks",
    image: nuts,
  },
];
