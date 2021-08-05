import React, { Component } from 'react'
import { formatCurrency, formatNumber } from './lib/format'
import TradeCompare from './TradeCompare'
import { OrderData } from './types/OrderData'

type ProductState = {

}

type ProductProps = {
  price: number
  balanceEth: number
  balanceUsd: number
  averagePricePaidForOpenLots: number
  totalPaidForOpenLots: number
  totalUnsoldSize: number
  lastFilledOrder?: OrderData
}


export class Product extends Component<ProductProps, ProductState> {

  render() {
    return (
      <div className="product">
        <div className="usd">
          <div className="balance">
            <h2>USD</h2>
            {formatCurrency(this.props.balanceUsd, true)}
          </div>
        </div>
        <div className="price">
          <h2>PRICE</h2>
          <h2>{formatCurrency(this.props.price, true)}</h2>
        </div>
        <div className="eth">
          <div className="balance">
            <h2>{formatNumber(this.props.totalUnsoldSize, true)} ETH</h2>
            {(typeof this.props.averagePricePaidForOpenLots === 'number' && typeof this.props.price === 'number') && (
              <TradeCompare
                lastTradePrice={this.props.averagePricePaidForOpenLots}
                currentPrice={this.props.price}
              />
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default Product
