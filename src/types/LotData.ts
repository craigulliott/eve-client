export type LotData = {
  id: string
  sequence: number
  state: 'new' | 'open' | 'closed'
  createdAt: number
  closedAt: number
  duration: number
  size: number
  price: number
  fee: number
  totalPriceExcludingFees: number
  totalPriceIncludingFees: number
  soldSize: number
  totalSellFees: number
  totalEarningsExcludingFees: number
  totalEarningsIncludingFees: number
  profit: number
  cumulativeProfit: number
  totalFees: number
  averageSellPrice: number
}
