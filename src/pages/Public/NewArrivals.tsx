import NewArrivalsHero from '../../components/new-arrivals/NewArrivalsHero'
import NewArrivalCard from '../../components/new-arrivals/NewArrivalCard'
import NewArrivalsSpecial from '../../components/new-arrivals/NewArrivalsSpecial'

import fruits from '../../assets/new-arrivals/cards/fresh-fruits.jpeg'
import vegetables from '../../assets/new-arrivals/cards/organic-vegetables.jpeg'
import dairy from '../../assets/new-arrivals/cards/dairy-products.jpeg'
import bakery from '../../assets/new-arrivals/cards/bakery-items.jpeg'
import snacks from '../../assets/new-arrivals/cards/snacks-new.jpeg'
import beverages from '../../assets/new-arrivals/cards/beverages-new.jpeg'

const NewArrivals = () => {
  return (
    <div className="bg-white">

      {/* HERO */}
      <NewArrivalsHero />

      {/* NEW ARRIVALS GRID */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-3xl font-bold text-center mb-10">
            Just Arrived
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <NewArrivalCard image={fruits} title="Fresh Fruits" />
            <NewArrivalCard image={vegetables} title="Organic Vegetables" />
            <NewArrivalCard image={dairy} title="Dairy Products" />
            <NewArrivalCard image={bakery} title="Bakery Items" />
            <NewArrivalCard image={snacks} title="New Snacks" />
            <NewArrivalCard image={beverages} title="Beverages" />
          </div>

        </div>
      </section>

      {/* SPECIAL */}
      <NewArrivalsSpecial />

    </div>
  )
}

export default NewArrivals
