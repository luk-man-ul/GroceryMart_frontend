

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-100">
     
{/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
           WHO ARE WE ?
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto mb-6">
            We are a network of local supermarket. we provide services to your doorstep.with the help of this centalized platforms.our network includes  x,y,z,a,b,c,d,g,e,f.
          </p>

        </div>
      </section>

    {/* Features */}
      <h1 className="text-2xl font-semibold mt-6 mb-0 text-center">Why choose us </h1>
      <section className="max-w-6xl mx-auto px-4 py-12">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold mb-2">🛒 Wide Product Range</h3>
            <p className="text-sm text-gray-600">
              Groceries, vegetables, fruits, snacks, and more.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold mb-2">💰 Best Prices</h3>
            <p className="text-sm text-gray-600">
              Affordable pricing with quality products.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold mb-2">🚚 Fast Delivery</h3>
            <p className="text-sm text-gray-600">
              Quick and reliable delivery to your home.
            </p>
          </div>
        </div>
      </section>

 {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Fresh Groceries Delivered to Your Doorstep
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto mb-6">
            Shop daily essentials, groceries, and household items at the
            best prices from your trusted supermarket.
          </p>

        </div>
      </section>

        {/* Call to Action */}
      <section className="bg-white border-t">
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-semibold mb-3">
            Start Shopping with SuperMart
          </h2>
          <p className="text-gray-600 mb-5">
        Join us and explore our products.
          </p>

          
        </div>
      </section>

      
    </div>
  )
}

export default AboutUs
