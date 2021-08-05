import axios from 'axios'
import React, { Component } from 'react'
import { Order } from './Order'
import Strategy from './Strategy'
import { OrderData } from './types/OrderData'
import { StrategyData } from './types/StrategyData'

type OrderState = {}
type OrderProps = {
  orders: OrderData[]
  strategies: StrategyData[]
}

export class Orders extends Component<OrderProps, OrderState> {

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
    const { orders, strategies } = this.props

    type O = {
      type: 'order',
      order: OrderData
    }

    type S = {
      type: 'strategy',
      strategy: StrategyData,
      orders: OrderData[]
    }

    // organize all the orders and strategies (strategies can contain orders)
    const orderedArray: Array<O | S> = []

    const strategyMap: {
      [key: string]: S
    } = {}

    for (let i = 0; i < orders.length; i++) {
      const order = orders[i]
      // if there is a strategy, then the order is grouped under the strategy with all the strategies orders
      if (order.strategyId) {
        // the first time this strategy is found, we create the object and
        // store a pointer to it for the next order which belongs to it
        if (typeof strategyMap[order.strategyId] === 'undefined') {
          const strategy = strategies.find(s => s.id === order.strategyId)
          if (typeof strategy === 'undefined') {
            // strategy not found (not loaded yet), so show the order inline
            orderedArray.push({
              type: 'order',
              order
            })
          }
          // the strategy is available, so group the orders with the strategy
          else {
            strategyMap[order.strategyId] = {
              type: 'strategy',
              // the current order is included
              orders: [order],
              strategy,
            }
            // add the strategy to the orderedArray list
            orderedArray.push(strategyMap[order.strategyId])
          }
        }
        // the strategy already exists, so just append the order so that the strategies orders are all grouped
        else {
          strategyMap[order.strategyId].orders.push(order)
        }
      }
      // this order does not have a strategy, so place it inline
      else {
        orderedArray.push({
          type: 'order',
          order
        })
      }
    }

    // also add any strategies which have no orders
    strategies.forEach(strategy => {
      if (typeof strategyMap[strategy.id] === 'undefined') {
        orderedArray.unshift({
          type: 'strategy',
          // the current order is included
          orders: [],
          strategy,
        })

      }
    })

    return (
      <div>
        <h2>Orders</h2>
        {orderedArray.slice(0, 50).map((orderOrStrategy, i) => (
          <div
            key={i}
          >
            {
              (orderOrStrategy.type === 'order' && (
                <Order
                  order={orderOrStrategy.order}
                />
              ))
              ||
              (orderOrStrategy.type === 'strategy' && (
                <Strategy
                  strategy={orderOrStrategy.strategy}
                  orders={orderOrStrategy.orders}
                />
              ))
            }
          </div>
        ))}
      </div>
    )
  }
}

export default Orders
