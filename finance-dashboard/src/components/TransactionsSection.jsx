import { useMemo, useState } from 'react'
import { useFinance } from '../context/FinanceContext'
import { filterAndSortTransactions, formatCurrency, formatDate } from '../utils/finance'

const emptyForm = {
  date: '',
  amount: '',
  category: '',
  type: 'expense',
  note: '',
}

function TransactionsSection() {
  const {
    role,
    transactions,
    filters,
    categories,
    setFilters,
    resetFilters,
    addTransaction,
    updateTransaction,
  } = useFinance()

  const [formState, setFormState] = useState(emptyForm)
  const [editingId, setEditingId] = useState('')

  const visibleTransactions = useMemo(
    () => filterAndSortTransactions(transactions, filters),
    [transactions, filters],
  )

  function startCreate() {
    setEditingId('new')
    setFormState({
      ...emptyForm,
      date: new Date().toISOString().slice(0, 10),
    })
  }

  function startEdit(transaction) {
    setEditingId(transaction.id)
    setFormState({
      date: transaction.date,
      amount: String(transaction.amount),
      category: transaction.category,
      type: transaction.type,
      note: transaction.note,
    })
  }

  function cancelEdit() {
    setEditingId('')
    setFormState(emptyForm)
  }

  function handleSubmit(event) {
    event.preventDefault()

    const payload = {
      ...formState,
      amount: Number(formState.amount),
      category: formState.category.trim(),
      note: formState.note.trim(),
    }

    if (editingId === 'new') {
      addTransaction(payload)
    } else if (editingId) {
      updateTransaction({ ...payload, id: editingId })
    }

    cancelEdit()
  }

  return (
    <section className="panel transactions-panel" aria-label="Transactions">
      <div className="transactions-head">
        <div>
          <h2>Transactions</h2>
          <p className="panel-copy">
            Search, sort, and filter your transaction history.
          </p>
        </div>
        {role === 'admin' ? (
          <button className="btn" type="button" onClick={startCreate}>
            Add Transaction
          </button>
        ) : (
          <p className="role-note">Viewer mode: read-only access</p>
        )}
      </div>

      <div className="filters-grid">
        <label className="field">
          <span>Search</span>
          <input
            type="text"
            value={filters.search}
            onChange={(event) => setFilters({ search: event.target.value })}
            placeholder="Category, note, date..."
          />
        </label>

        <label className="field">
          <span>Type</span>
          <select
            value={filters.type}
            onChange={(event) => setFilters({ type: event.target.value })}
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>

        <label className="field">
          <span>Category</span>
          <select
            value={filters.category}
            onChange={(event) => setFilters({ category: event.target.value })}
          >
            <option value="all">All</option>
            {categories.map((category) => (
              <option key={category} value={category.toLowerCase()}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Sort</span>
          <select
            value={filters.sortBy}
            onChange={(event) => setFilters({ sortBy: event.target.value })}
          >
            <option value="date-desc">Newest first</option>
            <option value="date-asc">Oldest first</option>
            <option value="amount-desc">Amount high to low</option>
            <option value="amount-asc">Amount low to high</option>
          </select>
        </label>
      </div>

      <button className="btn btn-light" type="button" onClick={resetFilters}>
        Reset Filters
      </button>

      {role === 'admin' && editingId ? (
        <form className="transaction-form" onSubmit={handleSubmit}>
          <h3>{editingId === 'new' ? 'Add Transaction' : 'Edit Transaction'}</h3>
          <div className="form-grid">
            <label className="field">
              <span>Date</span>
              <input
                type="date"
                value={formState.date}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, date: event.target.value }))
                }
                required
              />
            </label>

            <label className="field">
              <span>Amount</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formState.amount}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, amount: event.target.value }))
                }
                required
              />
            </label>

            <label className="field">
              <span>Category</span>
              <input
                type="text"
                value={formState.category}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, category: event.target.value }))
                }
                required
              />
            </label>

            <label className="field">
              <span>Type</span>
              <select
                value={formState.type}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, type: event.target.value }))
                }
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </label>
          </div>

          <label className="field">
            <span>Note</span>
            <input
              type="text"
              value={formState.note}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, note: event.target.value }))
              }
              placeholder="Optional details"
            />
          </label>

          <div className="form-actions">
            <button className="btn" type="submit">
              Save
            </button>
            <button className="btn btn-light" type="button" onClick={cancelEdit}>
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      {!visibleTransactions.length ? (
        <p className="empty-message">
          No transactions match your current filters.
        </p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Note</th>
                {role === 'admin' ? <th>Actions</th> : null}
              </tr>
            </thead>
            <tbody>
              {visibleTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{formatDate(transaction.date)}</td>
                  <td>{transaction.category}</td>
                  <td>
                    <span className={`pill ${transaction.type}`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="amount-cell">
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td>{transaction.note}</td>
                  {role === 'admin' ? (
                    <td>
                      <button
                        className="btn btn-small btn-light"
                        type="button"
                        onClick={() => startEdit(transaction)}
                      >
                        Edit
                      </button>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default TransactionsSection
