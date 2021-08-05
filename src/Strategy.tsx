import React, { Component } from 'react'
import { formatCurrency, unixtimeToDate, unixtimeToTime } from './lib/format'
import Order from './Order'
import { OrderData } from './types/OrderData'
import { StrategyData } from './types/StrategyData'

type StrategyState = {}
type StrategyProps = {
  strategy: StrategyData
  orders: OrderData[]
}

export class Strategy extends Component<StrategyProps, StrategyState> {

  render() {
    const { orders, strategy } = this.props

    return (
      <div className="strategy">
        <h3>
          {strategy.name} ({strategy.state})
          <span>{unixtimeToDate(strategy.createdAt)} {unixtimeToTime(strategy.createdAt)}</span>
        </h3>
        {(strategy.name === 'followNextPrice' && (
          <div>
            <p>
              {strategy.side}: {strategy.description}
            </p>
            <p>
              Original Price: {typeof strategy.originalPrice !== 'undefined' ? formatCurrency(strategy.originalPrice, true) : ''}
            </p>
            <p>
              Current Price: {typeof strategy.currentPrice !== 'undefined' ? formatCurrency(strategy.currentPrice, true) : ''}
            </p>
            <p>
              Price Drift: {typeof strategy.priceDrift !== 'undefined' ? formatCurrency(strategy.priceDrift, true) : ''}
            </p>
            <p>
              Total Price Drift: {typeof strategy.totalPriceDrift !== 'undefined' ? formatCurrency(strategy.totalPriceDrift, true) : ''}
            </p>
          </div>
        ))}
        {(strategy.name === 'trailingStop' && (
          <div>
            <p>
              {strategy.description}
            </p>
            <p>
              Delta: {formatCurrency(strategy.currentDelta, true)} (triggers {strategy.side} at {formatCurrency(strategy.triggerDelta, true)})
            </p>
            <p>
              Extreme Price: {formatCurrency(strategy.extremePrice, true)} ({formatCurrency(strategy.startPrice - strategy.extremePrice, true)} from {formatCurrency(strategy.startPrice, true)} start)
            </p>
          </div>
        ))}
        <div className='orders'>
          {orders.map(order => (
            <Order
              key={order.id}
              order={order}
            />
          ))}
        </div>
      </div>
    )
  }
}

export default Strategy
