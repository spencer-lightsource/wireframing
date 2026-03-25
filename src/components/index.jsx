/**
 * Wireframe primitives — modern minimal.
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

export function Row({ gap = 'md', align = 'center', justify, wrap, children, style, ...props }) {
  return (
    <div style={{ display: 'flex', gap: `var(--${gap})`, alignItems: align, justifyContent: justify, flexWrap: wrap ? 'wrap' : undefined, ...style }} {...props}>
      {children}
    </div>
  )
}

export function Spacer() {
  return <div style={{ flex: 1 }} />
}

// ── Typography ──────────────────────────────────────

export function H1({ children, style, ...props }) {
  return <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.3px', ...style }} {...props}>{children}</h1>
}

export function H2({ children, style, ...props }) {
  return <h2 style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.2px', ...style }} {...props}>{children}</h2>
}

export function H3({ children, style, ...props }) {
  return <h3 style={{ fontSize: 13, fontWeight: 600, ...style }} {...props}>{children}</h3>
}

export function Text({ muted, mono, size, children, style, ...props }) {
  return (
    <span style={{
      color: muted ? 'var(--fg-3)' : undefined,
      fontFamily: mono ? 'var(--mono)' : undefined,
      fontSize: size || (mono ? 11 : 13),
      ...style,
    }} {...props}>{children}</span>
  )
}

// ── Inputs ──────────────────────────────────────────

const inputBase = {
  height: 34,
  padding: '0 10px',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  fontSize: 13,
  fontFamily: 'inherit',
  background: 'var(--surface)',
  outline: 'none',
  width: '100%',
}

export function Input({ label, ...props }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {label && <Text muted size={12}>{label}</Text>}
      <input style={inputBase} {...props} />
    </label>
  )
}

export function Textarea({ label, rows = 3, ...props }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {label && <Text muted size={12}>{label}</Text>}
      <textarea style={{ ...inputBase, height: 'auto', padding: 10 }} rows={rows} {...props} />
    </label>
  )
}

export function Select({ label, options = [], ...props }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {label && <Text muted size={12}>{label}</Text>}
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
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
      <input type="checkbox" {...props} />
      {label}
    </label>
  )
}

// ── Buttons ─────────────────────────────────────────

const btnBase = {
  height: 34,
  padding: '0 14px',
  borderRadius: 'var(--radius)',
  fontSize: 13,
  fontFamily: 'inherit',
  fontWeight: 500,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  border: 'none',
  transition: 'opacity 0.15s',
  whiteSpace: 'nowrap',
}

export function Button({ variant = 'primary', children, style, ...props }) {
  const variants = {
    primary: { background: 'var(--accent)', color: 'var(--accent-fg)' },
    secondary: { background: 'transparent', color: 'var(--fg)', border: '1px solid var(--border)' },
    ghost: { background: 'transparent', color: 'var(--fg-2)', padding: '0 8px' },
    danger: { background: 'var(--red)', color: '#fff' },
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

export function Divider({ style }) {
  return <hr style={{ border: 'none', borderTop: '1px solid var(--border)', ...style }} />
}

export function Badge({ children, style }) {
  return (
    <span style={{
      fontSize: 11,
      fontWeight: 500,
      padding: '2px 8px',
      borderRadius: 99,
      border: '1px solid var(--border)',
      color: 'var(--fg-2)',
      ...style,
    }}>{children}</span>
  )
}

// ── Data ────────────────────────────────────────────

export function Table({ columns, rows, onRowClick, footer }) {
  const cellStyle = {
    padding: '9px 12px',
    borderBottom: '1px solid var(--border)',
    textAlign: 'left',
    fontSize: 12,
  }
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', background: 'var(--surface)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key || col} style={{ ...cellStyle, fontWeight: 500, fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
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
        {footer && (
          <tfoot>
            <tr>
              {columns.map((col, i) => {
                const key = col.key || col
                return <td key={key} style={{ ...cellStyle, fontWeight: 600, fontSize: 11, borderBottom: 'none', color: 'var(--fg-2)' }}>{footer[key] ?? ''}</td>
              })}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  )
}

export function KV({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border)' }}>
      <Text muted size={12}>{label}</Text>
      <Text size={12}>{value}</Text>
    </div>
  )
}

// ── Feedback ────────────────────────────────────────

export function EmptyState({ title, description, action }) {
  return (
    <div style={{ textAlign: 'center', padding: 'var(--xl) var(--lg)', color: 'var(--fg-3)' }}>
      <Text style={{ display: 'block', marginBottom: 4 }}>{title}</Text>
      {description && <Text muted size={12} style={{ display: 'block', marginBottom: 16 }}>{description}</Text>}
      {action}
    </div>
  )
}

export function Tag({ children, onRemove, style }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontSize: 12,
      padding: '3px 10px',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 6,
      ...style,
    }}>
      {children}
      {onRemove && <span onClick={onRemove} style={{ cursor: 'pointer', opacity: 0.5, marginLeft: 2 }}>x</span>}
    </span>
  )
}

// ── Overlay ─────────────────────────────────────────

export function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)' }} />
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
              padding: '8px 14px',
              fontSize: 12,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? 'var(--fg)' : 'var(--fg-3)',
              background: 'none',
              border: 'none',
              borderBottom: isActive ? '1.5px solid var(--accent)' : '1.5px solid transparent',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >{label}</button>
        )
      })}
    </div>
  )
}

// ── Pill toggle (Overview / Allocation style) ───────

export function PillToggle({ options, active, onChange }) {
  return (
    <div style={{ display: 'inline-flex', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
      {options.map(opt => {
        const key = typeof opt === 'string' ? opt : opt.key
        const label = typeof opt === 'string' ? opt : opt.label
        const isActive = active === key
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            style={{
              padding: '5px 14px',
              fontSize: 12,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? 'var(--fg)' : 'var(--fg-3)',
              background: isActive ? 'var(--surface)' : 'transparent',
              border: 'none',
              borderRight: '1px solid var(--border)',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >{label}</button>
        )
      })}
    </div>
  )
}

// ── Metric pill (Total spend $37.7M style) ──────────

export function MetricPill({ label, value, color }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '5px 14px',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      fontSize: 12,
    }}>
      <span style={{ color: 'var(--fg-3)' }}>{label}</span>
      <span style={{ fontWeight: 600, color: color || 'var(--fg)' }}>{value}</span>
    </span>
  )
}

// ── Allocation bar ──────────────────────────────────

export function AllocationBar({ percent, style }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, ...style }}>
      <span style={{ fontSize: 12, minWidth: 32 }}>{percent}%</span>
      <div style={{ flex: 1, height: 4, background: '#eee', borderRadius: 2, minWidth: 60 }}>
        <div style={{ width: `${Math.min(percent * 10, 100)}%`, height: '100%', background: '#ccc', borderRadius: 2 }} />
      </div>
    </div>
  )
}

// ── Price delta ─────────────────────────────────────

export function PriceDelta({ value, direction = 'up' }) {
  const isUp = direction === 'up'
  return (
    <span style={{ fontSize: 11, fontWeight: 500, color: isUp ? 'var(--orange)' : 'var(--green)' }}>
      {isUp ? '↑' : '↓'}{value}
    </span>
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
