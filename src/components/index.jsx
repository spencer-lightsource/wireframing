/**
 * Wireframe primitives — ultra minimal, no frills.
 * Import what you need: import { Button, Input, Card } from '../components'
 */

import { Link } from 'react-router-dom'

// ── Layout ──────────────────────────────────────────

export function Stack({ gap = 'md', children, style, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: `var(--${gap})`, ...style }} {...props}>
      {children}
    </div>
  )
}

export function Row({ gap = 'md', align = 'center', justify, children, style, ...props }) {
  return (
    <div style={{ display: 'flex', gap: `var(--${gap})`, alignItems: align, justifyContent: justify, ...style }} {...props}>
      {children}
    </div>
  )
}

export function Spacer() {
  return <div style={{ flex: 1 }} />
}

// ── Typography ──────────────────────────────────────

export function H1({ children, ...props }) {
  return <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.5px' }} {...props}>{children}</h1>
}

export function H2({ children, ...props }) {
  return <h2 style={{ fontSize: 18, fontWeight: 600 }} {...props}>{children}</h2>
}

export function H3({ children, ...props }) {
  return <h3 style={{ fontSize: 14, fontWeight: 600 }} {...props}>{children}</h3>
}

export function Text({ muted, mono, size, children, style, ...props }) {
  return (
    <span style={{
      color: muted ? 'var(--fg-3)' : undefined,
      fontFamily: mono ? 'var(--mono)' : undefined,
      fontSize: size || (mono ? 12 : 14),
      ...style,
    }} {...props}>{children}</span>
  )
}

// ── Inputs ──────────────────────────────────────────

const inputBase = {
  height: 36,
  padding: '0 12px',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  fontSize: 14,
  fontFamily: 'inherit',
  background: 'var(--surface)',
  outline: 'none',
  width: '100%',
}

export function Input({ label, ...props }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && <Text muted size={13}>{label}</Text>}
      <input style={inputBase} {...props} />
    </label>
  )
}

export function Textarea({ label, rows = 3, ...props }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && <Text muted size={13}>{label}</Text>}
      <textarea style={{ ...inputBase, height: 'auto', padding: 12 }} rows={rows} {...props} />
    </label>
  )
}

export function Select({ label, options = [], ...props }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && <Text muted size={13}>{label}</Text>}
      <select style={{ ...inputBase, cursor: 'pointer' }} {...props}>
        {options.map(o => typeof o === 'string'
          ? <option key={o} value={o}>{o}</option>
          : <option key={o.value} value={o.value}>{o.label}</option>
        )}
      </select>
    </label>
  )
}

export function Checkbox({ label, ...props }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
      <input type="checkbox" {...props} />
      {label}
    </label>
  )
}

export function Toggle({ label, ...props }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
      <input type="checkbox" role="switch" {...props} />
      {label}
    </label>
  )
}

// ── Buttons ─────────────────────────────────────────

const btnBase = {
  height: 36,
  padding: '0 16px',
  borderRadius: 'var(--radius)',
  fontSize: 14,
  fontFamily: 'inherit',
  fontWeight: 500,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  border: 'none',
  transition: 'opacity 0.1s',
}

export function Button({ variant = 'primary', children, style, ...props }) {
  const variants = {
    primary: { background: 'var(--accent)', color: 'var(--accent-fg)' },
    secondary: { background: 'transparent', color: 'var(--fg)', border: '1px solid var(--border)' },
    ghost: { background: 'transparent', color: 'var(--fg-2)' },
    danger: { background: 'var(--danger)', color: '#fff' },
  }
  return <button style={{ ...btnBase, ...variants[variant], ...style }} {...props}>{children}</button>
}

export function LinkButton({ to, children, ...props }) {
  return <Link to={to}><Button {...props}>{children}</Button></Link>
}

// ── Surfaces ────────────────────────────────────────

export function Card({ children, style, ...props }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: 'var(--lg)',
      ...style,
    }} {...props}>{children}</div>
  )
}

export function Divider() {
  return <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: 'var(--md) 0' }} />
}

export function Badge({ children, style }) {
  return (
    <span style={{
      fontSize: 11,
      fontWeight: 600,
      padding: '2px 8px',
      borderRadius: 99,
      border: '1px solid var(--border)',
      color: 'var(--fg-2)',
      ...style,
    }}>{children}</span>
  )
}

// ── Data ────────────────────────────────────────────

export function Table({ columns, rows, onRowClick }) {
  const cellStyle = {
    padding: '10px 12px',
    borderBottom: '1px solid var(--border)',
    textAlign: 'left',
    fontSize: 13,
  }
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', background: 'var(--surface)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key || col} style={{ ...cellStyle, fontWeight: 600, fontSize: 12, color: 'var(--fg-3)', background: 'var(--bg)' }}>
                {col.label || col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} onClick={() => onRowClick?.(row, i)} style={{ cursor: onRowClick ? 'pointer' : undefined }}>
              {columns.map(col => {
                const key = col.key || col
                return <td key={key} style={cellStyle}>{col.render ? col.render(row[key], row) : row[key]}</td>
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function KV({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
      <Text muted>{label}</Text>
      <Text>{value}</Text>
    </div>
  )
}

// ── Feedback ────────────────────────────────────────

export function EmptyState({ title, description, action }) {
  return (
    <div style={{ textAlign: 'center', padding: 'var(--xl) var(--lg)', color: 'var(--fg-3)' }}>
      <Text style={{ display: 'block', marginBottom: 4 }}>{title}</Text>
      {description && <Text muted size={13} style={{ display: 'block', marginBottom: 16 }}>{description}</Text>}
      {action}
    </div>
  )
}

export function Tag({ children, style }) {
  return (
    <span style={{
      display: 'inline-block',
      fontSize: 12,
      padding: '2px 8px',
      background: 'var(--bg)',
      border: '1px solid var(--border)',
      borderRadius: 4,
      ...style,
    }}>{children}</span>
  )
}

// ── Overlay ─────────────────────────────────────────

export function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)' }} />
      <div style={{
        position: 'relative',
        background: 'var(--surface)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
        padding: 'var(--lg)',
        width: 480,
        maxWidth: '90vw',
        maxHeight: '80vh',
        overflow: 'auto',
      }}>
        {title && <H2 style={{ marginBottom: 'var(--md)' }}>{title}</H2>}
        {children}
        {footer && <Row gap="sm" justify="flex-end" style={{ marginTop: 'var(--lg)' }}>{footer}</Row>}
      </div>
    </div>
  )
}

// ── Nav ─────────────────────────────────────────────

export function Tabs({ tabs, active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)' }}>
      {tabs.map(t => {
        const key = typeof t === 'string' ? t : t.key
        const label = typeof t === 'string' ? t : t.label
        const isActive = active === key
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            style={{
              padding: '10px 16px',
              fontSize: 13,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? 'var(--fg)' : 'var(--fg-3)',
              background: 'none',
              border: 'none',
              borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >{label}</button>
        )
      })}
    </div>
  )
}

// ── Flow helpers ────────────────────────────────────

export function FlowSteps({ steps, current }) {
  return (
    <div className="flow-steps">
      {steps.map((label, i) => {
        const cls = i === current ? 'active' : i < current ? 'done' : ''
        return (
          <div key={i}>
            {i > 0 && <span className="step-divider" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 8 }} />}
            <span className={`step ${cls}`} style={{ display: 'inline-flex' }}>
              <span className="step-num">{i + 1}</span>
              <span>{label}</span>
            </span>
          </div>
        )
      })}
    </div>
  )
}
