import PromoCard from './PromoCard'

import farmFresh from '../../assets/home/promos/farm-fresh.jpeg'
import vegetables from '../../assets/home/promos/vegetables.jpeg'

const HomePromos = () => {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6 space-y-8">

        {/* CARD 1 */}
        <PromoCard
          title="We Will Meet All Your Farm Fresh Needs"
          subtitle="Meat, fish, fruits, and fresh groceries sourced daily."
          image={farmFresh}
          bgColor="bg-[#ffd1c7]"
          badgeText="20% OFF"
        />

        {/* CARD 2 */}
        <PromoCard
          title="Fresh and Healthy Vegetables"
          subtitle="Recoup your annual grocery cost through savings within a year."
          image={vegetables}
          bgColor="bg-[#ffe0a3]"
          reverse
        />

      </div>
    </section>
  )
}

export default HomePromos
