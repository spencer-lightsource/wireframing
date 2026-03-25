import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Text, Spacer } from '../components'
import registry from '../flows/registry'

const navLinkStyle = ({ isActive }) => ({
  padding: '7px 12px',
  fontSize: 13,
  borderRadius: 'var(--radius)',
  color: isActive ? 'var(--fg)' : 'var(--fg-3)',
  background: isActive ? 'var(--bg)' : 'transparent',
  fontWeight: isActive ? 500 : 400,
  textDecoration: 'none',
  display: 'block',
})

const sectionLabel = {
  fontSize: 10,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  color: 'var(--fg-3)',
  padding: '16px 12px 6px',
}

export default function SaasLayout() {
  const location = useLocation()
  const currentFlow = registry.find(f => location.pathname.includes(f.id))
  const isWide = currentFlow?.wide

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {/* Sidebar */}
      <aside style={{
        width: 'var(--sidebar-w)',
        borderRight: '1px solid var(--border)',
        background: 'var(--surface)',
        display: 'flex',
        flexDirection: 'column',
        padding: 'var(--md)',
        flexShrink: 0,
      }}>
        <Link to="/" style={{ fontWeight: 600, fontSize: 14, padding: '4px 12px', marginBottom: 'var(--sm)', textDecoration: 'none', color: 'var(--fg)' }}>
          Wireframes
        </Link>

        <div style={sectionLabel}>Vignettes</div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {registry.map(flow => (
            <NavLink key={flow.id} to={`/flows/${flow.id}`} style={navLinkStyle}>
              {flow.title}
            </NavLink>
          ))}
        </nav>

        <Spacer />

        <NavLink to="/" end style={navLinkStyle}>
          <Text muted size={11}>All vignettes</Text>
        </NavLink>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ maxWidth: isWide ? '100%' : 960, margin: '0 auto', padding: isWide ? 0 : 'var(--xl) var(--lg)' }}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
