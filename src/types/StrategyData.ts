
type FollowNextPriceStrategyData = {
  id: string
  sequence: number
  name: 'followNextPrice'
  state: 'active' | 'ended'
  side: 'buy' | 'sell'
  createdAt: number
  description: string
  originalPrice: number
  currentPrice: number
  priceDrift: number
  totalPriceDrift: number
}

type TrailingStopStrategyData = {
  id: string
  sequence: number
  name: 'trailingStop'
  state: 'active' | 'ended'
  side: 'buy' | 'sell'
  createdAt: number
  description: string
  triggerDelta: number
  currentDelta: number
  extremePrice: number
  startPrice: number
}

export type StrategyData = FollowNextPriceStrategyData | TrailingStopStrategyData
