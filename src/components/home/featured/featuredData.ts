import banana from "../../../assets/home/featured/banana.jpeg";
import carrot from "../../../assets/home/featured/carrot.jpeg";
import cauli from "../../../assets/home/featured/cauli.jpeg";
import strawberry from "../../../assets/home/featured/strawberry.jpeg";
import mangosteen from "../../../assets/home/featured/mangosteen.jpeg";
import kiwi from "../../../assets/home/featured/kiwi.jpeg";
import minnelos from "../../../assets/home/featured/minnelos.jpeg";

export type FeaturedItem = {
  id: number;
  title: string;
  price: number;
  oldPrice: number;
  discount: string;
  image: string;
};

export const featuredData: FeaturedItem[] = [
  {
    id: 1,
    title: "Fresh Cauliflower",
    price: 12,
    oldPrice: 15,
    discount: "6% OFF",
    image: cauli,
  },
  {
    id: 2,
    title: "Strawberry",
    price: 10,
    oldPrice: 13,
    discount: "2% OFF",
    image: strawberry,
  },
  {
    id: 3,
    title: "Mangosteen",
    price: 5,
    oldPrice: 8,
    discount: "5% OFF",
    image: mangosteen,
  },
  {
    id: 4,
    title: "Carrot",
    price: 15,
    oldPrice: 20,
    discount: "3% OFF",
    image: carrot,
  },
  {
    id: 5,
    title: "Banana",
    price: 9,
    oldPrice: 10,
    discount: "2% OFF",
    image: banana,
  },
  {
    id: 6,
    title: "Kiwi",
    price: 7,
    oldPrice: 9,
    discount: "4% OFF",
    image: kiwi,
  },
  {
    id: 7,
    title: "Minnelos",
    price: 11,
    oldPrice: 14,
    discount: "3% OFF",
    image: minnelos,
  },
];
