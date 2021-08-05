import { FillData } from "./FillData";

export type OrderData = {
  id: string
  sequence: number
  side: 'buy' | 'sell'
  price: number
  size: number
  filledSize: number
  orderNumber?: string
  filledPercent: number
  state: 'new' | 'creating' | 'created' | 'filled' | 'canceling' | 'canceled'
  createdAt: number
  createFailedMessage?: string
  strategyName: string
  strategyId: string
  fills: FillData[]
}
