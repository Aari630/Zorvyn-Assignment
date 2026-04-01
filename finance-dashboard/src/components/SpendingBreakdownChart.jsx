import { useMemo } from 'react'
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { useFinance } from '../context/FinanceContext'
import { formatCurrency, getSpendingByCategory } from '../utils/finance'

const COLORS = ['#2f4b7c', '#4e79a7', '#f28e2b', '#76b7b2', '#59a14f', '#e15759']

function SpendingBreakdownChart() {
  const { transactions } = useFinance()

  const chartData = useMemo(
    () => getSpendingByCategory(transactions),
    [transactions],
  )

  return (
    <article className="panel chart-panel">
      <h2>Spending Breakdown</h2>
      <p className="panel-copy">Where your expense money is going</p>
      {!chartData.length ? (
        <p className="empty-message">No expense transactions to categorize.</p>
      ) : (
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`${entry.name}-${entry.value}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </article>
  )
}

export default SpendingBreakdownChart
