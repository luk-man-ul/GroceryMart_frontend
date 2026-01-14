export type GuestCartItem = {
  productId: number
  quantity: number
}

export const getGuestCart = (): GuestCartItem[] => {
  const data = localStorage.getItem('guest_cart')
  return data ? JSON.parse(data) : []
}

export const setGuestCart = (items: GuestCartItem[]) => {
  localStorage.setItem('guest_cart', JSON.stringify(items))
}

export const clearGuestCart = () => {
  localStorage.removeItem('guest_cart')
}
