import aboutHero from "../../assets/about/about-hero.png";

const AboutHero = () => {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* IMAGE */}
          <div className="relative">
            <img
              src={aboutHero}
              alt="About SuperMart"
              className="w-full h-[420px] object-cover rounded-2xl shadow-lg"
            />
          </div>

          {/* CONTENT */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Who We Are
            </h1>

            <p className="text-gray-600 mb-4 leading-relaxed">
              SuperMart is a modern grocery platform built to connect local
              supermarkets directly with customers. We make daily essentials
              easily accessible with fast delivery and transparent pricing.
            </p>

            <p className="text-gray-600 leading-relaxed">
              Our mission is to simplify grocery shopping by combining
              technology, trust, and local partnerships—bringing fresh
              groceries straight to your doorstep.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutHero;
