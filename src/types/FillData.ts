export type FillData = {
  id: string
  sequence: number
  orderId: string
  size: number
  price: number
  totalPrice: number
  fee: number
  createdAt: number
  source: 'Api' | 'Feed'
}
