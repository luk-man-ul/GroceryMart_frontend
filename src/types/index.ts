export type UserRole = 'USER' | 'ADMIN'

export interface JwtPayload {
  sub: number
  email: string
  role: UserRole
}

export interface Product {
  id: number
  name: string
  price: number
  imageUrl: string
  stock: number
  category: Category
}

export interface Product {
  id: number
  name: string
  price: number           // MRP
  offerPrice?: number     // Discounted price
  image?: string
  stock: number
  stockType: string
  description?: string
  category: Category
}

export interface CartItem {
  id: number            // ✅ cartItem id (from backend)
  productId: number
  quantity: number
  total: number
  product: Product
}


export interface Category {
  id: number
  name: string
}

