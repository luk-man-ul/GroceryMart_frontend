const WhyChooseUs = () => {
  return (
    <section className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose Us
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
            <div className="text-4xl mb-4">🛒</div>
            <h3 className="font-semibold text-lg mb-2">
              Wide Product Range
            </h3>
            <p className="text-gray-600 text-sm">
              Groceries, vegetables, fruits, snacks, dairy, and more — all in one place.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="font-semibold text-lg mb-2">
              Best Prices
            </h3>
            <p className="text-gray-600 text-sm">
              Competitive pricing with quality products sourced from trusted sellers.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="font-semibold text-lg mb-2">
              Fast Delivery
            </h3>
            <p className="text-gray-600 text-sm">
              Reliable and timely delivery straight to your doorstep.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
