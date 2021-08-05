import axios from 'axios'
import React, { Component } from 'react'
import { formatCurrency, formatNumber } from './lib/format'
import { OrderData } from './types/OrderData'
import { unixtimeToDate, unixtimeToTime } from './lib/format'

type OrderState = {}
type OrderProps = {
  order: OrderData
}

export class Order extends Component<OrderProps, OrderState> {

  private cancel(id: string) {
    axios({
      method: 'post',
      url: 'http://localhost:8000/cancel',
      data: {
        id: id,
      }
    })
  }

  render() {
    const { order } = this.props

    return (
      <div
        className={`order ${order.side} ${order.state}`}
      >
        <h3>
          {order.side} ({order.state})
          <span>{unixtimeToDate(order.createdAt)} {unixtimeToTime(order.createdAt)} {order.strategyName}</span>
        </h3>
        <div className='container'>
          <div className='info'>
            {order.createFailedMessage && (
              <p className="error">
                {order.createFailedMessage}
              </p>
            )}
            <p className="price">
              Price: {formatCurrency(order.price, true)}
            </p>
            <p className="size">
              Size: {formatNumber(order.size, true)} ETH
            </p>
            <p className="filled">
              Filled: {formatNumber(order.filledPercent, true)}%
            </p>
            <p className="id">
              ID: {order.id}
            </p>
            <div className="fills">
              {order.fills.map(fill => (
                <p
                  key={fill.id}
                >
                  {unixtimeToDate(fill.createdAt)}
                  {' '}
                  {unixtimeToTime(fill.createdAt)}
                  {': '}
                  {formatNumber(fill.size, true)}
                  {' '}
                  ETH at
                  {' '}
                  {formatCurrency(fill.price, true)}
                </p>
              ))}
            </div>
          </div>
          <div className='controls'>
            {order.state === 'created' && (
              <button
                onClick={() => {
                  this.cancel(order.id)
                }}
              >
                CANCEL
              </button>
            )}
          </div>
        </div>

      </div>
    )
  }
}

export default Order
