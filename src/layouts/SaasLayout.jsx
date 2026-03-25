import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Text, Spacer } from '../components'

const navLinkStyle = ({ isActive }) => ({
  padding: '8px 12px',
  fontSize: 13,
  borderRadius: 'var(--radius)',
  color: isActive ? 'var(--fg)' : 'var(--fg-3)',
  background: isActive ? 'var(--bg)' : 'transparent',
  fontWeight: isActive ? 500 : 400,
  textDecoration: 'none',
})

export default function SaasLayout({ nav = [] }) {
  const location = useLocation()

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
        <Link to="/" style={{ fontWeight: 600, fontSize: 15, padding: '4px 12px', marginBottom: 'var(--lg)', textDecoration: 'none', color: 'var(--fg)' }}>
          Acme
        </Link>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {nav.map(item => (
            <NavLink key={item.to} to={item.to} style={navLinkStyle} end={item.end}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Spacer />

        <div style={{ padding: '8px 12px', borderTop: '1px solid var(--border)', marginTop: 'var(--md)' }}>
          <Text muted size={12}>user@acme.com</Text>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: 'var(--xl) var(--lg)' }}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
