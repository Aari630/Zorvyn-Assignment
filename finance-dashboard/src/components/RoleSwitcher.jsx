import { useFinance } from '../context/FinanceContext'

function RoleSwitcher() {
  const { role, setRole } = useFinance()

  return (
    <div className="panel role-switcher">
      <div>
        <p className="eyebrow">UI Role</p>
        <h2>Role Based Controls</h2>
      </div>
      <label htmlFor="role" className="field">
        <span>Switch role</span>
        <select
          id="role"
          value={role}
          onChange={(event) => setRole(event.target.value)}
        >
          <option value="viewer">Viewer</option>
          <option value="admin">Admin</option>
        </select>
      </label>
    </div>
  )
}

export default RoleSwitcher
