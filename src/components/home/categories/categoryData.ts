import beverages from "../../../assets/home/categories/beverages.png";
import dairy from "../../../assets/home/categories/dairy.jpeg";
import electronics from "../../../assets/home/categories/electronics.png";
import grocery from "../../../assets/home/categories/grocery.png";
import homeCare from "../../../assets/home/categories/home-care.png";
import meat from "../../../assets/home/categories/meat.jpeg";
import noodles from "../../../assets/home/categories/noodles.jpeg";
import personal from "../../../assets/home/categories/personal.png";
import petCare from "../../../assets/home/categories/pet-care.png";
import snacks from "../../../assets/home/categories/snacks.png";
import vegetables from "../../../assets/home/categories/vegetables.jpeg";

export type CategoryItem = {
  id: number;
  name: string;
  image: string;
};

export const categoryData: CategoryItem[] = [
  { id: 1, name: "Beverages", image: beverages },
  { id: 2, name: "Snacks", image: snacks },
  { id: 3, name: "Home Care", image: homeCare },
  { id: 4, name: "Noodles & Sauces", image: noodles },
  { id: 5, name: "Personal Care", image: personal },
  { id: 6, name: "Pet Care", image: petCare },
  { id: 7, name: "Vegetables & Fruits", image: vegetables },
  { id: 8, name: "Grocery & Staples", image: grocery },
  { id: 9, name: "Dairy & Eggs", image: dairy },
  { id: 10, name: "Meat & Seafood", image: meat },
  { id: 11, name: "Electronics", image: electronics },
];
