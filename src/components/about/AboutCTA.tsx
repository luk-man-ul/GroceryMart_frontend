import { Link } from "react-router-dom";

const AboutCTA = () => {
  return (
    <section className="bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Start Shopping with SuperMart
        </h2>

        <p className="text-gray-300 mb-8 max-w-xl mx-auto">
          Join thousands of customers who trust SuperMart for their daily groceries.
        </p>

        <Link
          to="/products"
          className="inline-block bg-orange-500 text-white px-10 py-3 rounded-xl text-lg hover:bg-orange-600 transition"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
};

export default AboutCTA;
