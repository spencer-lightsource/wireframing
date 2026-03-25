/**
 * AI interaction primitives for wireframing AI-enabled flows.
 *
 * - AIInput: big text area with a "generate" action
 * - AIThinking: pulsing indicator while AI "processes"
 * - AISuggestion: a dismissable suggestion card
 * - useAI: hook that simulates AI processing with a delay
 */
import { useState, useCallback } from 'react'
import { Row, Text, Button, Card } from './index'

// ── Simulated AI hook ───────────────────────────────

export function useAI(processFn, delay = 1500) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const run = useCallback((input) => {
    setLoading(true)
    setResult(null)
    setTimeout(() => {
      setResult(processFn(input))
      setLoading(false)
    }, delay)
  }, [processFn, delay])

  const reset = () => { setResult(null); setLoading(false) }

  return { loading, result, run, reset }
}

// ── AI Text Input ───────────────────────────────────

export function AIInput({ value, onChange, onSubmit, placeholder, loading, buttonLabel = 'Generate' }) {
  return (
    <div style={{
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      background: 'var(--surface)',
      overflow: 'hidden',
    }}>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        style={{
          width: '100%',
          border: 'none',
          outline: 'none',
          padding: 'var(--md)',
          fontSize: 14,
          fontFamily: 'inherit',
          resize: 'vertical',
          background: 'transparent',
        }}
        onKeyDown={e => { if (e.metaKey && e.key === 'Enter') onSubmit() }}
      />
      <Row style={{ padding: 'var(--sm) var(--md)', borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
        <Text muted size={12}>Cmd+Enter to submit</Text>
        <div style={{ flex: 1 }} />
        <Button onClick={onSubmit} disabled={loading} style={{ height: 32, fontSize: 13 }}>
          {loading ? 'Thinking...' : buttonLabel}
        </Button>
      </Row>
    </div>
  )
}

// ── AI Thinking Indicator ───────────────────────────

export function AIThinking({ label = 'AI is analyzing...' }) {
  return (
    <Row gap="sm" style={{ padding: 'var(--md)', color: 'var(--fg-3)' }}>
      <span style={{ animation: 'pulse 1.5s infinite', fontSize: 12 }}>
        {'● ● ●'}
      </span>
      <Text muted size={13}>{label}</Text>
      <style>{`@keyframes pulse { 0%,100% { opacity:.3 } 50% { opacity:1 } }`}</style>
    </Row>
  )
}

// ── AI Suggestion Card ──────────────────────────────

export function AISuggestion({ title, children, onAccept, onDismiss }) {
  return (
    <Card style={{ borderLeft: '3px solid var(--fg-3)', background: 'var(--bg)' }}>
      <Row gap="sm" style={{ marginBottom: 'var(--sm)' }}>
        <Text size={12} muted style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          AI Suggestion
        </Text>
      </Row>
      {title && <Text style={{ display: 'block', fontWeight: 500, marginBottom: 4 }}>{title}</Text>}
      <div style={{ fontSize: 13, color: 'var(--fg-2)', marginBottom: 'var(--md)' }}>{children}</div>
      <Row gap="sm">
        {onAccept && <Button style={{ height: 28, fontSize: 12 }} onClick={onAccept}>Accept</Button>}
        {onDismiss && <Button variant="ghost" style={{ height: 28, fontSize: 12 }} onClick={onDismiss}>Dismiss</Button>}
      </Row>
    </Card>
  )
}
