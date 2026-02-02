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

export const categoryImageMap: Record<string, string> = {
  Beverages: beverages,
  Snacks: snacks,
  "Home Care": homeCare,
  "Noodles & Sauces": noodles,
  "Personal Care": personal,
  "Pet Care": petCare,
  "Vegetables & Fruits": vegetables,
  "Grocery & Staples": grocery,
  "Dairy & Eggs": dairy,
  "Meat & Seafood": meat,
  Electronics: electronics,
};
