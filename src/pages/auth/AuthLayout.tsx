// AuthLayout.tsx
import loginBg from '../../assets/login/loginbg.jpeg'

type Props = {
  children: React.ReactNode
}

const AuthLayout = ({ children }: Props) => {
  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex items-center"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* LEFT CONTENT */}
      <div className="relative hidden md:flex flex-col justify-center max-w-xl px-24 text-white">
        {/* Brand title */}
        <h1 className="text-5xl font-bold tracking-tight mb-4">
          <span className="text-green-500">Super</span>
          <span className="text-orange-500">Market</span>
        </h1>

        {/* Small accent line (optional but nice) */}
        <div className="w-16 h-1 bg-green-500 mb-6"></div>

        {/* Description */}
        <p className="text-lg text-white/90 leading-relaxed max-w-md">
          Fresh groceries, daily essentials, and quality products delivered
          with ease. Shop smart, shop fresh, shop SuperMarket.
        </p>
      </div>

      {/* RIGHT CONTENT */}
      <div className="relative w-full max-w-sm ml-auto mr-6 md:mr-20">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-6 animate-fadeIn">
          {children}
        </div>
      </div>
    </div>
  )
}

export default AuthLayout