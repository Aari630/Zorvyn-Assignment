import { useMemo } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useFinance } from '../context/FinanceContext'
import { formatCurrency, getMonthlyTrend } from '../utils/finance'

function BalanceTrendChart() {
  const { transactions } = useFinance()

  const chartData = useMemo(
    () => getMonthlyTrend(transactions),
    [transactions],
  )

  return (
    <article className="panel chart-panel">
      <h2>Balance Trend</h2>
      <p className="panel-copy">Monthly running balance over time</p>
      {!chartData.length ? (
        <p className="empty-message">No data available for trend chart.</p>
      ) : (
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="4 4" stroke="rgba(0, 40, 73, 0.16)" />
              <XAxis dataKey="label" stroke="#33556e" />
              <YAxis
                stroke="#33556e"
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Line
                type="monotone"
                dataKey="runningBalance"
                stroke="#0b9d88"
                strokeWidth={3}
                dot={{ r: 4, fill: '#0b9d88' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </article>
  )
}

export default BalanceTrendChart
