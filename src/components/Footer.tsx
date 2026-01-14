import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

const Footer = () => {
  return (
    <footer className="hidden sm:block bg-rose-50 border-t mt-16 ">
      {/* Divider */}
      <div className="border-t " />

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm ">
        {/* Brand Info */}
        <div>
          <div className="text-xl font-bold text-green-700 mb-2">
              Super<span className="text-red-600">Market</span>
          </div>
          <p className="text-gray-600 leading-relaxed">
            SuperMarket brings its customers low prices every day. We offer a wide
            choice covering fresh & packaged food, grains, pulses, dairy,
            frozen, plastics, utensils, crockery, travel, stationery & more.
          </p>

          <div className="flex gap-4 mt-4">
            <Facebook size={18} />
            <Twitter size={18} />
            <Instagram size={18} />
            <Linkedin size={18} />
          </div>
        </div>

        {/* Your Account */}
        <div>
          <h3 className="font-semibold mb-3">Your Account</h3>
          <ul className="space-y-2 text-gray-600">
            <li>FAQs</li>
            <li>Store List</li>
          </ul>
        </div>

        {/* Help & Support */}
        <div>
          <h3 className="font-semibold mb-3">Help & Support</h3>
          <ul className="space-y-2 text-gray-600">
            <li>Share Feedback</li>
            <li>Call Us</li>
          </ul>
        </div>

        {/* About */}
        <div>
          <h3 className="font-semibold mb-3">About Us</h3>
          <ul className="space-y-2 text-gray-600">
            <li>Terms</li>
            <li>Privacy Policy</li>
            <li>Return & Refund Policy</li>
          </ul>

          <div className="flex gap-3 mt-4">
            <img
              src="/appstore.png"
              alt="App Store"
              className="h-10 cursor-pointer"
            />
            <img
              src="/playstore.png"
              alt="Google Play"
              className="h-10 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer


