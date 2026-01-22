import delivery from '../../assets/deals/icons/delivery.png'
import price from '../../assets/deals/icons/price.png'
import fresh from '../../assets/deals/icons/fresh.png'

const DealsTrust = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-6 text-center">

        <h2 className="text-2xl font-bold mb-10">
          Why Choose SuperMart
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: delivery,
              title: 'Fast Delivery',
              desc: 'Quick and reliable delivery at your doorstep.',
            },
            {
              icon: price,
              title: 'Best Prices',
              desc: 'Unbeatable prices with frequent offers.',
            },
            {
              icon: fresh,
              title: 'Fresh Products',
              desc: 'Only the freshest groceries every day.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <img
                src={item.icon}
                alt={item.title}
                className="w-14 h-14 mx-auto mb-4"
              />
              <h4 className="font-semibold mb-2">{item.title}</h4>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default DealsTrust
