import React, { Component } from 'react'
import { formatCurrency, formatNumber } from './lib/format'

type TradeState = {}
type TradeProps = {
  lastTradePrice: number
  currentPrice: number
}

export class TradeCompare extends Component<TradeProps, TradeState> {

  render() {
    const { currentPrice, lastTradePrice } = this.props
    const upOrDown = currentPrice < lastTradePrice ? 'down' : 'up'
    const percentageMovement = ((currentPrice / lastTradePrice) - 1) * 100
    return (
      <div>
        <div className='last'>
          <p>Average price paid: {formatCurrency(lastTradePrice, true)}</p>
          <h3 className={upOrDown}>
            {formatCurrency(currentPrice - lastTradePrice, true)}
            {` `}
            {formatNumber(percentageMovement, true)}%
          </h3>
        </div>
      </div>
    )
  }
}

export default TradeCompare
