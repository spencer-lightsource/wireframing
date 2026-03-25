/**
 * Vignette browser — the landing page.
 * Shows all registered flows as cards that anyone can click into and try.
 */
import { Link } from 'react-router-dom'
import { Stack, Row, H1, H2, Text, Card, Tag, Spacer } from '../components'
import registry from './registry'

export default function FlowBrowser() {
  return (
    <Stack gap="lg">
      <div>
        <H1>Flow Prototypes</H1>
        <Text muted>Click any flow to walk through it. Each is a self-contained user journey.</Text>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--md)' }}>
        {registry.map(flow => (
          <Link key={flow.id} to={`/flows/${flow.id}`} style={{ textDecoration: 'none' }}>
            <Card style={{ height: '100%', cursor: 'pointer', transition: 'border-color 0.15s', }}>
              <Stack gap="sm">
                <H2>{flow.title}</H2>
                <Text muted size={13}>{flow.description}</Text>
                {flow.tags?.length > 0 && (
                  <Row gap="xs" style={{ flexWrap: 'wrap', marginTop: 4 }}>
                    {flow.tags.map(t => <Tag key={t}>{t}</Tag>)}
                  </Row>
                )}
              </Stack>
            </Card>
          </Link>
        ))}
      </div>

      {registry.length === 0 && (
        <Card style={{ textAlign: 'center', padding: 'var(--xl)' }}>
          <Text muted>No flows yet. Create one in src/flows/ and register it in registry.js</Text>
        </Card>
      )}
    </Stack>
  )
}
