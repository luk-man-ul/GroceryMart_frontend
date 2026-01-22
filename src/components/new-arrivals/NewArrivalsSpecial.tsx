const NewArrivalsSpecial = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-6 text-center">

        <h2 className="text-2xl font-bold mb-10">
          Why These Products Are Special
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'Fresh Stock',
              desc: 'Newly arrived items sourced daily.',
            },
            {
              title: 'Limited Quantity',
              desc: 'Get them before they sell out.',
            },
            {
              title: 'Best Price',
              desc: 'Introductory prices on new products.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <h4 className="font-semibold mb-2">{item.title}</h4>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default NewArrivalsSpecial
