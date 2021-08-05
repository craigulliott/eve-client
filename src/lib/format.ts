import humanizeDuration from 'humanize-duration'

export function formatNumber(number: number, showDecimal = false, highAccuracy = false) {
  if (typeof number === 'number') {
    const str = showDecimal ? number.toFixed(highAccuracy ? 8 : 2).toString() : Math.round(number).toString()
    let x = str.split('.')
    let x1 = x[0]
    let x2 = x.length > 1 ? '.' + x[1] : ''
    var rgx = /(\d+)(\d{3})/
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1,$2')
    }
    return x1 + x2
  }
}

export function formatCurrency(number: number, showCents = false) {
  const str = formatNumber(number, showCents)
  if (typeof str !== 'undefined') {
    return str[0] === '-' ? `-$${str.substr(1)}` : `$${str}`
  }
}

export function unixtimeToDate(unittime: number) {
  var date = new Date(unittime * 1000)
  return date.toLocaleDateString()
}

export function unixtimeToTime(unittime: number) {
  var date = new Date(unittime * 1000)
  return date.toLocaleTimeString()
}


export function secondsToHuman(seconds: number): string {
  return humanizeDuration(seconds * 1000)
}
