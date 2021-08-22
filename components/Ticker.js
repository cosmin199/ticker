import { useEffect, useState, useMemo } from "react"
import Chart from "react-apexcharts"

// const proxyUrl = "https://cors-anywhere.herokuapp.com"

// const stonksUrl = `${proxyUrl}https://query1.finance.yahoo.com/v8/finance/chart/MSFT`

const stonksUrl = "https://yahoo-finance-api.vercel.app/BTC-USD"

async function getStonks() {
  const response = await fetch(stonksUrl)
  return response.json()
}

const directionEmojis = {
  up: "🚀",
  down: "🔻",
  "": "",
}

const chart = {
  options: {
    chart: {
      type: "candlestick",
      height: 350,
    },
    title: {
      text: "CandleStick Chart",
      align: "left",
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
  },
}

const round = (number) => {
  return number ? +number.toFixed(2) : null
}

function Ticker() {
  const [series, setSeries] = useState([
    {
      data: [],
    },
  ])
  const [price, setPrice] = useState(-1)
  const [prevPrice, setPrevPrice] = useState(-1)
  const [priceTime, setPriceTime] = useState(null)
  const [symbol, setSymbol] = useState(null)

  useEffect(() => {
    let timeoutId
    async function getLatestPrice() {
      try {
        const data = await getStonks()
        const ticker = data.chart.result[0]
        setSymbol(ticker.meta.symbol)
        setPrevPrice(price)
        setPrice(ticker.meta.regularMarketPrice.toFixed(2))
        setPriceTime(new Date(ticker.meta.regularMarketTime * 1000))
        const quote = ticker.indicators.quote[0]
        const prices = ticker.timestamp.map((timestamp, index) => ({
          x: new Date(timestamp * 1000),
          y: [
            quote.open[index],
            quote.high[index],
            quote.low[index],
            quote.close[index],
          ].map(round),
        }))
        setSeries([
          {
            data: prices,
          },
        ])
      } catch (error) {
        console.log(error)
      }
      timeoutId = setTimeout(getLatestPrice, 5000 * 2)
    }

    getLatestPrice()

    return () => {
      clearTimeout(timeoutId)
    }
  }, [])

  const direction = useMemo(
    () => (prevPrice < price ? "up" : prevPrice > price ? "down" : ""),
    [prevPrice, price]
  )

  return (
    <div>
      <div className="ticker">{symbol} </div>
      <div className={["price", direction].join(" ")}>
        ${price} {directionEmojis[direction]}
      </div>
      <div className="price-time">
        {priceTime && priceTime.toLocaleTimeString()}
      </div>
      <Chart
        options={chart.options}
        series={series}
        type="candlestick"
        width="100%"
        height={320}
      />
    </div>
  )
}

export default Ticker
