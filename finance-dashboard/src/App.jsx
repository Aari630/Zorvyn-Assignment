import RoleSwitcher from './components/RoleSwitcher'
import SummaryCards from './components/SummaryCards'
import BalanceTrendChart from './components/BalanceTrendChart'
import SpendingBreakdownChart from './components/SpendingBreakdownChart'
import TransactionsSection from './components/TransactionsSection'
import InsightsPanel from './components/InsightsPanel'
import { FinanceProvider } from './context/FinanceContext'

function App() {
  return (
    <FinanceProvider>
      <main className="dashboard">
        <header className="dashboard-header reveal">
          <div>
            <p className="eyebrow">Finance Dashboard UI</p>
            <h1>Personal Finance Control Center</h1>
            <p className="hero-copy">
              Track balances, review transactions, and understand spending
              patterns from one clean workspace.
            </p>
          </div>
          <RoleSwitcher />
        </header>

        <section className="reveal reveal-delay-1">
          <SummaryCards />
        </section>

        <section className="chart-grid reveal reveal-delay-2">
          <BalanceTrendChart />
          <SpendingBreakdownChart />
        </section>

        <section className="reveal reveal-delay-3">
          <InsightsPanel />
        </section>

        <section className="reveal reveal-delay-4">
          <TransactionsSection />
        </section>
      </main>
    </FinanceProvider>
  )
}

export default App
