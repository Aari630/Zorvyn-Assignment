const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const monthLabelFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
})

const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: '2-digit',
  year: 'numeric',
})

export function formatCurrency(value) {
  return currencyFormatter.format(Number(value) || 0)
}

export function formatDate(dateString) {
  return shortDateFormatter.format(new Date(dateString))
}

export function calculateSummary(transactions) {
  const income = transactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((sum, transaction) => sum + Number(transaction.amount), 0)

  const expenses = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((sum, transaction) => sum + Number(transaction.amount), 0)

  return {
    income,
    expenses,
    balance: income - expenses,
  }
}

export function getMonthlyTrend(transactions) {
  const monthMap = new Map()

  transactions
    .slice()
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .forEach((transaction) => {
      const currentDate = new Date(transaction.date)
      const monthKey = `${currentDate.getFullYear()}-${String(
        currentDate.getMonth() + 1,
      ).padStart(2, '0')}`

      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, {
          monthKey,
          label: monthLabelFormatter.format(currentDate),
          income: 0,
          expenses: 0,
          net: 0,
        })
      }

      const entry = monthMap.get(monthKey)
      if (transaction.type === 'income') {
        entry.income += Number(transaction.amount)
        entry.net += Number(transaction.amount)
      } else {
        entry.expenses += Number(transaction.amount)
        entry.net -= Number(transaction.amount)
      }
    })

  let runningBalance = 0
  return Array.from(monthMap.values()).map((entry) => {
    runningBalance += entry.net
    return {
      ...entry,
      runningBalance,
    }
  })
}

export function getSpendingByCategory(transactions) {
  const categoryTotals = new Map()

  transactions
    .filter((transaction) => transaction.type === 'expense')
    .forEach((transaction) => {
      const currentTotal = categoryTotals.get(transaction.category) ?? 0
      categoryTotals.set(
        transaction.category,
        currentTotal + Number(transaction.amount),
      )
    })

  return Array.from(categoryTotals.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}

export function getInsights(transactions) {
  if (!transactions.length) {
    return {
      topCategory: 'No data yet',
      topCategoryAmount: 0,
      monthlyComparison: 'No monthly data available',
      usefulObservation: 'Add transactions to unlock insights.',
    }
  }

  const spendingByCategory = getSpendingByCategory(transactions)
  const topCategory = spendingByCategory[0]

  const monthlyTrend = getMonthlyTrend(transactions)
  const currentMonth = monthlyTrend.at(-1)
  const previousMonth = monthlyTrend.at(-2)

  let monthlyComparison = 'No prior month available for comparison'

  if (currentMonth && previousMonth) {
    const diff = currentMonth.expenses - previousMonth.expenses
    const trendDirection = diff > 0 ? 'up' : 'down'
    const baseline = previousMonth.expenses || 1
    const pct = Math.abs((diff / baseline) * 100).toFixed(1)
    monthlyComparison = `Expenses are ${trendDirection} ${pct}% vs last month`
  }

  const avgExpense =
    transactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((sum, transaction) => sum + Number(transaction.amount), 0) /
    Math.max(
      transactions.filter((transaction) => transaction.type === 'expense').length,
      1,
    )

  const usefulObservation =
    avgExpense > 200
      ? 'Average expense size is high. Consider budgeting large purchases separately.'
      : 'Expense distribution looks steady. Keep monitoring recurring costs.'

  return {
    topCategory: topCategory?.name ?? 'No expense categories',
    topCategoryAmount: topCategory?.value ?? 0,
    monthlyComparison,
    usefulObservation,
  }
}

export function filterAndSortTransactions(transactions, filters) {
  const { search, type, category, sortBy } = filters

  const filtered = transactions.filter((transaction) => {
    const matchesType = type === 'all' || transaction.type === type
    const matchesCategory =
      category === 'all' || transaction.category.toLowerCase() === category

    const text = `${transaction.category} ${transaction.note} ${transaction.amount} ${transaction.date}`.toLowerCase()
    const matchesSearch = !search || text.includes(search.toLowerCase())

    return matchesType && matchesCategory && matchesSearch
  })

  const sorted = filtered.sort((a, b) => {
    switch (sortBy) {
      case 'date-asc':
        return new Date(a.date) - new Date(b.date)
      case 'amount-desc':
        return Number(b.amount) - Number(a.amount)
      case 'amount-asc':
        return Number(a.amount) - Number(b.amount)
      case 'date-desc':
      default:
        return new Date(b.date) - new Date(a.date)
    }
  })

  return sorted
}
