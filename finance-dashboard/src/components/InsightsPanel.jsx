import { useMemo } from 'react'
import { useFinance } from '../context/FinanceContext'
import { formatCurrency, getInsights } from '../utils/finance'

function InsightsPanel() {
  const { transactions } = useFinance()

  const insights = useMemo(() => getInsights(transactions), [transactions])

  return (
    <section className="panel insights-panel" aria-label="Spending insights">
      <h2>Insights</h2>
      <div className="insight-grid">
        <article className="insight-item">
          <p className="eyebrow">Highest spending category</p>
          <p className="insight-main">{insights.topCategory}</p>
          <p>{formatCurrency(insights.topCategoryAmount)}</p>
        </article>

        <article className="insight-item">
          <p className="eyebrow">Monthly comparison</p>
          <p className="insight-main">{insights.monthlyComparison}</p>
        </article>

        <article className="insight-item">
          <p className="eyebrow">Observation</p>
          <p className="insight-main">{insights.usefulObservation}</p>
        </article>
      </div>
    </section>
  )
}

export default InsightsPanel
