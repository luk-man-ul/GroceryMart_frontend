const MissionVision = () => {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* MISSION */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              Our Mission
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Our mission is to make grocery shopping simple, fast, and affordable
              by connecting customers with local supermarkets through a centralized
              digital platform.
            </p>
          </div>

          {/* VISION */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              Our Vision
            </h3>
            <p className="text-gray-600 leading-relaxed">
              We envision a future where local businesses thrive digitally and
              customers enjoy seamless access to daily essentials without hassle.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default MissionVision;
