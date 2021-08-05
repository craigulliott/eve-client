import React, { Component } from 'react'
import './App.scss'
import { w3cwebsocket as W3CWebSocket } from "websocket"
import axios from 'axios'
import Orders from './Orders'
import { sortByCreatedAt } from './lib/sortByCreatedAt'
import { OrderMap } from './types/OrderMap'
import { StrategyMap } from './types/StrategyMap'
import { LotMap } from './types/LotMap'
import Lots from './Lots'
import Product from './Product'
import Candlestick from './Candlestick'

const client = new W3CWebSocket('ws://127.0.0.1:8000')

type ProductState = {
  productLoaded: false
  price: undefined
  averagePricePaidForOpenLots: undefined
  totalPaidForOpenLots: undefined
  totalUnsoldSize: undefined
} | {
  productLoaded: true
  price: number
  averagePricePaidForOpenLots: number
  totalPaidForOpenLots: number
  totalUnsoldSize: number
}

type BalanceState = {
  balanceLoaded: false
  balanceEth: undefined
  balanceUsd: undefined
} | {
  balanceLoaded: true
  balanceEth: number
  balanceUsd: number
}

type OrdersState = {
  ordersLoaded: boolean
  orders: OrderMap
}

type StrategiesState = {
  strategiesLoaded: boolean
  strategies: StrategyMap
}

type LotsState = {
  lotsLoaded: boolean
  lots: LotMap
}

type AppState = ProductState & BalanceState & OrdersState & StrategiesState & LotsState
type AppProps = {}

class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    this.state = {
      // balance
      balanceLoaded: false,
      balanceEth: undefined,
      balanceUsd: undefined,
      averagePricePaidForOpenLots: undefined,
      totalPaidForOpenLots: undefined,
      totalUnsoldSize: undefined,
      // product
      productLoaded: false,
      price: undefined,
      // orders
      ordersLoaded: false,
      orders: {},
      // strategies
      strategiesLoaded: false,
      strategies: {},
      // lots
      lotsLoaded: false,
      lots: {},
    }
  }

  componentWillMount() {
    client.onmessage = (message) => {
      const rawData = message.data

      if (typeof rawData === 'string') {
        const {name, data} = JSON.parse(rawData)

        switch (name) {

          case 'product':
            this.setState((state, props) => {
              return {
                price: data.currentPrice,
                averagePricePaidForOpenLots: data.averagePricePaidForOpenLots,
                totalPaidForOpenLots: data.totalPaidForOpenLots,
                totalUnsoldSize: data.totalUnsoldSize,
                productLoaded: true
              }
            })
            break;

          case 'balance':
            this.setState((state, props) => {
              return { balanceEth: data.eth, balanceUsd: data.usd, balanceLoaded: true }
            })
            break

          case 'order':
            // skip this if we already have a more up to date record (this is because some messages can arrive out of order)
            if (this.state.orders[data.id] && this.state.orders[data.id].sequence > data.sequence) {
              console.log(`Skipping order ${data.id} update because we already have more current data`)
              return
            }
            this.setState((state, props) => {
              const orders = Object.assign(state.orders)
              // store the record
              orders[data.id] = {
                id: data.id,
                sequence: data.sequence,
                side: data.side,
                price: data.price,
                size: data.size,
                filledSize: data.filledSize,
                orderNumber: data.orderNumber,
                filledPercent: data.filledPercent,
                state: data.state,
                createdAt: data.createdAt,
                createFailedMessage: data.createFailedMessage,
                strategyName: data.strategyName,
                strategyId: data.strategyId,
                fills: data.fills,
              }
              return { orders }
            })
            break

          case 'followNextPrice':
            // skip this if we already have a more up to date record (this is because some messages can arrive out of order)
            if (this.state.strategies[data.id] && this.state.strategies[data.id].sequence > data.sequence) {
              console.log(`Skipping strategy ${data.id} update because we already have more current data`)
              return
            }
            this.setState((state, props) => {
              const strategies = Object.assign(state.strategies)
              strategies[data.id] = {
                id: data.id,
                sequence: data.sequence,
                side: data.side,
                name: data.name,
                state: data.state,
                createdAt: data.createdAt,
                description: data.description,
                originalPrice: data.originalPrice,
                currentPrice: data.currentPrice,
                priceDrift: data.priceDrift,
                totalPriceDrift: data.totalPriceDrift,
              }
              return { strategies }
            })
            break

          case 'trailingStop':
            // skip this if we already have a more up to date record (this is because some messages can arrive out of order)
            if (this.state.strategies[data.id] && this.state.strategies[data.id].sequence > data.sequence) {
              console.log(`Skipping strategy ${data.id} update because we already have more current data`)
              return
            }
            this.setState((state, props) => {
              const strategies = Object.assign(state.strategies)
              strategies[data.id] = {
                id: data.id,
                sequence: data.sequence,
                side: data.side,
                name: data.name,
                state: data.state,
                createdAt: data.createdAt,
                description: data.description,
                triggerDelta: data.triggerDelta,
                currentDelta: data.currentDelta,
                extremePrice: data.extremePrice,
                startPrice: data.startPrice,
              }
              return { strategies }
            })
            break

          case 'lot':
            // skip this if we already have a more up to date record (this is because some messages can arrive out of order)
            if (this.state.lots[data.id] && this.state.lots[data.id].sequence > data.sequence) {
              console.log(`Skipping lot ${data.id} update because we already have more current data`)
              return
            }
            this.setState((state, props) => {
              const lots = Object.assign(state.lots)
              lots[data.id] = {
                id: data.id,
                sequence: data.sequence,
                state: data.state,
                createdAt: data.createdAt,
                closedAt: data.closedAt,
                duration: data.duration,
                size: data.size,
                price: data.price,
                fee: data.fee,
                totalPriceExcludingFees: data.totalPriceExcludingFees,
                totalPriceIncludingFees: data.totalPriceIncludingFees,
                soldSize: data.soldSize,
                totalSellFees: data.totalSellFees,
                totalEarningsExcludingFees: data.totalEarningsExcludingFees,
                totalEarningsIncludingFees: data.totalEarningsIncludingFees,
                profit: data.profit,
                cumulativeProfit: data.cumulativeProfit,
                totalFees: data.totalFees,
                averageSellPrice: data.averageSellPrice,
              }
              return { lots }
            })
            break

          }
      } else {
        throw new Error('unexpected type for websocket message')
      }
    }
  }

  componentDidMount() {
    this.fetchProduct()
    this.fetchBalance()
    this.fetchStrategies()
    this.fetchOrders()
    this.fetchLots()
  }

  private fetchBalance() {
    fetch("http://localhost:8000/balance").then(res => res.json()).then(
      (result) => {
        this.setState((state, props) => {
          return { balanceEth: result.eth, balanceUsd: result.usd, balanceLoaded: true }
        })
      },
      (error) => {
        console.log('failed fetching balance', error)
        throw new Error('failed fetching balance')
      }
    )
  }

  private fetchProduct() {
    fetch("http://localhost:8000/product").then(res => res.json()).then(
      (result) => {
        this.setState((state, props) => {
          return {
            price: result.currentPrice,
            averagePricePaidForOpenLots: result.averagePricePaidForOpenLots,
            totalPaidForOpenLots: result.totalPaidForOpenLots,
            totalUnsoldSize: result.totalUnsoldSize,
            productLoaded: true
          }
        })
      },
      (error) => {
        console.log('failed fetching product', error)
        throw new Error('failed fetching product')
      }
    )
  }
  private fetchOrders() {
    fetch("http://localhost:8000/orders").then(res => res.json()).then(
      (result) => {
        const orders: OrderMap = {}
        for (let i = 0; i < result.data.length; i++) {
          const order = result.data[i]
          // skip this if we already have a more up to date record (this is because some messages can arrive out of order)
          if (this.state.orders[order.id] && this.state.orders[order.id].sequence > order.sequence) {
            console.log(`Skipping order ${order.id} update because we already have more current data`)
            continue
          }
          // store the record
          orders[order.id] = {
            id: order.id,
            sequence: order.sequence,
            side: order.side,
            price: order.price,
            size: order.size,
            filledSize: order.filledSize,
            orderNumber: order.orderNumber,
            filledPercent: order.filledPercent,
            state: order.state,
            createdAt: order.createdAt,
            createFailedMessage: order.createFailedMessage,
            strategyName: order.strategyName,
            strategyId: order.strategyId,
            fills: order.fills,
          }
        }
        this.setState((state, props) => {
          return { orders: orders, ordersLoaded: true }
        })
      },
      (error) => {
        console.log('failed fetching orders', error)
        throw new Error('failed fetching orders')
      }
    )
  }

  private fetchStrategies() {
    fetch("http://localhost:8000/strategies").then(res => res.json()).then(
      (result) => {
        const strategies: StrategyMap = {}
        for (let i = 0; i < result.data.length; i++) {
          const strategy = result.data[i]
          // skip this if we already have a more up to date record (this is because some messages can arrive out of order)
          if (this.state.strategies[strategy.id] && this.state.strategies[strategy.id].sequence > strategy.sequence) {
            console.log(`Skipping strategy ${strategy.id} update because we already have more current data`)
            continue
          }
          // store the record
          switch (strategy.name) {
            case 'followNextPrice':
              strategies[strategy.id] = {
                id: strategy.id,
                sequence: strategy.sequence,
                side: strategy.side,
                name: strategy.name,
                state: strategy.state,
                description: strategy.description,
                createdAt: strategy.createdAt,
                originalPrice: strategy.originalPrice,
                currentPrice: strategy.currentPrice,
                priceDrift: strategy.priceDrift,
                totalPriceDrift: strategy.totalPriceDrift,
              }
              break;

            case 'trailingStop':
              strategies[strategy.id] = {
                id: strategy.id,
                sequence: strategy.sequence,
                side: strategy.side,
                name: strategy.name,
                state: strategy.state,
                description: strategy.description,
                createdAt: strategy.createdAt,
                triggerDelta: strategy.triggerDelta,
                currentDelta: strategy.currentDelta,
                extremePrice: strategy.extremePrice,
                startPrice: strategy.startPrice,
              }
              break;

            default:
              throw new Error(`unexpected strategy type ${strategy.name}`)
          }
        }
        this.setState((state, props) => {
          return { strategies: strategies, strategiesLoaded: true }
        })
      },
      (error) => {
        console.log('failed fetching strategies', error)
        throw new Error('failed fetching strategies')
      }
    )
  }

  private fetchLots() {
    fetch("http://localhost:8000/lots").then(res => res.json()).then(
      (result) => {
        const lots: LotMap = {}
        for (let i = 0; i < result.data.length; i++) {
          const lot = result.data[i]
          // skip this if we already have a more up to date record (this is because some messages can arrive out of order)
          if (this.state.lots[lot.id] && this.state.lots[lot.id].sequence > lot.sequence) {
            console.log(`Skipping lot ${lot.id} update because we already have more current data`)
            continue
          }
          // store the record
          lots[lot.id] = {
            id: lot.id,
            sequence: lot.sequence,
            state: lot.state,
            createdAt: lot.createdAt,
            closedAt: lot.closedAt,
            duration: lot.duration,
            size: lot.size,
            price: lot.price,
            fee: lot.fee,
            totalPriceExcludingFees: lot.totalPriceExcludingFees,
            totalPriceIncludingFees: lot.totalPriceIncludingFees,
            soldSize: lot.soldSize,
            totalSellFees: lot.totalSellFees,
            totalEarningsExcludingFees: lot.totalEarningsExcludingFees,
            totalEarningsIncludingFees: lot.totalEarningsIncludingFees,
            profit: lot.profit,
            cumulativeProfit: lot.cumulativeProfit,
            totalFees: lot.totalFees,
            averageSellPrice: lot.averageSellPrice,
          }
        }
        this.setState((state, props) => {
          return { lots: lots, lotsLoaded: true }
        })
      },
      (error) => {
        console.log('failed fetching lots', error)
        throw new Error('failed fetching lots')
      }
    )
  }

  private buy(strategy: string) {
    axios({
      method: 'post',
      url: 'http://localhost:8000/buy',
      data: {
        strategy,
      }
    })
  }

  private sell(strategy: string) {
    axios({
      method: 'post',
      url: 'http://localhost:8000/sell',
      data: {
        strategy,
      }
    })
  }

  private cancel() {
    axios({
      method: 'post',
      url: 'http://localhost:8000/cancelAll',
      data: {
        type: "todo",
      }
    })
  }

  render() {
    const orders = Object.values(this.state.orders).sort(sortByCreatedAt)
    const strategies = Object.values(this.state.strategies).sort(sortByCreatedAt)
    const lastFilledOrder = orders.find(o => o.state === 'filled')


    const lots = Object.values(this.state.lots).reverse()

    return (
      <div className="main">

        {this.state.balanceLoaded && this.state.productLoaded && (
          <Product
            lastFilledOrder={lastFilledOrder}
            balanceEth={this.state.balanceEth}
            balanceUsd={this.state.balanceUsd}
            price={this.state.price}
            averagePricePaidForOpenLots={this.state.averagePricePaidForOpenLots}
            totalPaidForOpenLots={this.state.totalPaidForOpenLots}
            totalUnsoldSize={this.state.totalUnsoldSize}
          />
        )}

        {/* <Candlestick
          periodLengthInSeconds={60}
        />

        <Candlestick
          periodLengthInSeconds={3600}
        /> */}

        <div className="actions">

          <div className="buy">
            <h3>BUY</h3>
            <p>
              <button
                onClick={() => {
                  this.buy('followNextPrice')
                }}
              >
                FOLLOW PRICE
              </button>
            </p>
            <p>
              <button
                onClick={() => {
                  this.buy('threeDollarTrailingStop')
                }}
              >
                $3 TRAILING STOP
              </button>
            </p>
            <p>
              <button
                onClick={() => {
                  this.buy('fiveDollarTrailingStop')
                }}
              >
                $5 TRAILING STOP
              </button>
            </p>
          </div>

          <div className="cancel">
            <h3>CANCEL</h3>
            <p>
              <button
                onClick={() => {
                  this.cancel()
                }}
              >
                CANCEL ALL
              </button>
            </p>
          </div>

          <div className="sell">
            <h3>SELL</h3>
            <p>
              <button
                onClick={() => {
                  this.sell('followNextPrice')
                }}
              >
                FOLLOW PRICE
              </button>
            </p>
            <p>
              <button
                onClick={() => {
                  this.sell('threeDollarTrailingStop')
                }}
              >
                $3 TRAILING STOP
              </button>
            </p>
            <p>
              <button
                onClick={() => {
                  this.sell('fiveDollarTrailingStop')
                }}
              >
                $5 TRAILING STOP
              </button>
            </p>
          </div>

        </div>

        <div className="activity">

          <div className="orders">
            <Orders
              orders={orders}
              strategies={strategies}
            />
          </div>

          <div className="lots">
            {this.state.lotsLoaded && (
              <Lots
                lots={lots}
              />
            )}
          </div>

        </div>

      </div>
    )
  }
}

export default App
