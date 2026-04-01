import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { mockTransactions } from '../data/mockTransactions'

const STORAGE_KEY = 'finance-dashboard-state-v1'

const initialFilters = {
  search: '',
  type: 'all',
  category: 'all',
  sortBy: 'date-desc',
}

const initialState = {
  role: 'viewer',
  transactions: mockTransactions,
  filters: initialFilters,
}

const FinanceContext = createContext(null)

function financeReducer(state, action) {
  switch (action.type) {
    case 'setRole':
      return { ...state, role: action.payload }
    case 'setFilters':
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      }
    case 'resetFilters':
      return {
        ...state,
        filters: initialFilters,
      }
    case 'addTransaction':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      }
    case 'updateTransaction':
      return {
        ...state,
        transactions: state.transactions.map((transaction) =>
          transaction.id === action.payload.id ? action.payload : transaction,
        ),
      }
    default:
      return state
  }
}

function loadInitialState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return initialState
    }

    const parsed = JSON.parse(stored)
    return {
      ...initialState,
      ...parsed,
      filters: {
        ...initialFilters,
        ...(parsed.filters ?? {}),
      },
    }
  } catch {
    return initialState
  }
}

export function FinanceProvider({ children }) {
  const [state, dispatch] = useReducer(financeReducer, initialState, loadInitialState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const value = useMemo(() => {
    const categories = Array.from(
      new Set(state.transactions.map((transaction) => transaction.category)),
    ).sort((a, b) => a.localeCompare(b))

    return {
      ...state,
      categories,
      setRole: (role) => dispatch({ type: 'setRole', payload: role }),
      setFilters: (filters) => dispatch({ type: 'setFilters', payload: filters }),
      resetFilters: () => dispatch({ type: 'resetFilters' }),
      addTransaction: (transactionInput) => {
        dispatch({
          type: 'addTransaction',
          payload: {
            ...transactionInput,
            id: `txn-${crypto.randomUUID()}`,
          },
        })
      },
      updateTransaction: (transactionInput) => {
        dispatch({
          type: 'updateTransaction',
          payload: transactionInput,
        })
      },
    }
  }, [state])

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  )
}

export function useFinance() {
  const context = useContext(FinanceContext)

  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider')
  }

  return context
}
