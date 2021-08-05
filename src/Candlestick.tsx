import React, { Component } from "react"
import Chart from "react-apexcharts"
import { unixtimeToTime } from "./lib/format"

type Candle = [timestamp: number, open: number, high: number, low: number, close: number]

type CandleMap = {
  [key: string]: Candle
}

type CandlestickState = {
  candles: CandleMap
}
type CandlestickProps = {
  periodLengthInSeconds: number
}

class Candlestick extends Component<CandlestickProps, CandlestickState> {
  constructor(props: CandlestickProps) {
    super(props)

    this.state = {
      candles: {},
    }
  }

  private fetchCandles() {
    fetch(`http://localhost:8000/periods?periodLengthInSeconds=${this.props.periodLengthInSeconds}`).then(res => res.json()).then(
      (result) => {
        const candles: CandleMap = {}
        for (let i = 0; i < result.data.length; i++) {
          const candle = result.data[i]
          // store the record
          candles[candle.endTime as number] = [candle.endTime * 1000, candle.open, candle.high, candle.low, candle.close]
        }
        this.setState((state, props) => {
          return { candles: candles }
        })
      },
      (error) => {
        console.log('failed fetching candles', error)
        throw new Error('failed fetching candles')
      }
    )
  }

  componentDidMount() {
    this.fetchCandles()
  }

  render() {
    const options = {
      chart: {
        type: 'candlestick',
        height: 290,
        id: 'candles',
        toolbar: {
          autoSelected: 'pan',
          show: false
        },
        zoom: {
          enabled: false
        },
      },
      plotOptions: {
        candlestick: {
          colors: {
            upward: '#28c128',
            downward: '#c12828'
          }
        }
      },
      tooltip: {
        enabled: true,
      },
      xaxis: {
        labels: {
          formatter: function (value: number) {
            return unixtimeToTime(value);
          }
        }
      },
      yaxis: {
        tooltip: {
          enabled: true
        }
      }
    }
    const series = [
      {
        name: "series-1",
        data: Object.values(this.state.candles)
      }
    ]

    return (
      <div className="candlestick">
        <div className="row">
          <div className="mixed-chart">
            {series[0].data.length > 0 && (
              <Chart
                // @ts-ignore
                options={options}
                series={series}
                type="candlestick"
                width={500}
              />
            )}
            {series[0].data.length === 0 && (
              <h3>Loading</h3>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default Candlestick
