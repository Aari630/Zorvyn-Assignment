import { useMemo } from 'react'
import { useFinance } from '../context/FinanceContext'
import { calculateSummary, formatCurrency } from '../utils/finance'

function SummaryCards() {
  const { transactions } = useFinance()

  const summary = useMemo(
    () => calculateSummary(transactions),
    [transactions],
  )

  const cards = [
    { label: 'Total Balance', value: summary.balance, tone: 'balance' },
    { label: 'Income', value: summary.income, tone: 'income' },
    { label: 'Expenses', value: summary.expenses, tone: 'expense' },
  ]

  return (
    <section className="summary-grid" aria-label="Financial summary">
      {cards.map((card) => (
        <article key={card.label} className={`panel summary-card ${card.tone}`}>
          <p className="eyebrow">{card.label}</p>
          <p className="summary-value">{formatCurrency(card.value)}</p>
        </article>
      ))}
    </section>
  )
}

export default SummaryCards
