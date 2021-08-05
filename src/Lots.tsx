import React, { Component } from 'react'
import { formatCurrency, formatNumber, secondsToHuman, unixtimeToDate, unixtimeToTime } from './lib/format'
import { LotData } from './types/LotData'

type LotState = {}
type LotProps = {
  lots: LotData[]
}

export class Lots extends Component<LotProps, LotState> {

  render() {
    const lots = this.props.lots.slice(0, 100)
    return (
      <div>
        <h2>Lots</h2>
        {lots.map((lot) => (
          <div
            key={lot.id}
            className={`lot ${lot.closedAt ? 'closed' : 'open'}`}
          >
            <div className="info">
              {(lot.state === 'open' || lot.state === 'new') && (
                <p>
                  Created: {unixtimeToDate(lot.createdAt)} {unixtimeToTime(lot.createdAt)}
                </p>
              )}
              {lot.state === 'closed' && (
                <p>
                  Closed: {unixtimeToDate(lot.closedAt)} {unixtimeToTime(lot.closedAt)}
                </p>
              )}
              <p>
                Size: {formatNumber(lot.size, true, true)}
              </p>
              <p>
                Buy Price: {formatCurrency(lot.price, true)}
              </p>
              {lot.state === 'open' && (
                <>
                  <p>
                    Average Sell Price: {formatCurrency(lot.averageSellPrice, true)}
                  </p>
                  <p>
                    Sold: {formatNumber(lot.soldSize/lot.size*100)}%
                  </p>
                </>
              )}
              {lot.state === 'closed' && (
                <>
                  <p>
                    Average Sell Price: {formatCurrency(lot.averageSellPrice, true)}
                  </p>
                  <p>
                    Total Fee: {formatCurrency(lot.totalFees, true)}
                  </p>
                </>
              )}
            </div>
            {lot.state === 'closed' && (
              <>
                <div
                  className={`profit ${lot.profit > 0 ? 'up' : 'down'}`}
                >
                  {formatCurrency(lot.profit)}
                </div>
                <div
                  className={`cumulative ${lot.cumulativeProfit > 0 ? 'up' : 'down'}`}
                >
                  {formatCurrency(lot.cumulativeProfit)}
                </div>
              </>
            )}
            {lot.state === 'open' && (
              <>
                <div
                  className={`profit ${lot.profit > 0 ? 'up' : 'down'}`}
                >
                  {formatCurrency(lot.profit)}
                </div>
                <div
                  className="cumulative"
                >
                  OPEN
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    )
  }
}

export default Lots
