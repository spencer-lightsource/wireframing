/**
 * Award Flow — Scenario-based award optimization for sourcing projects.
 *
 * Screens from Figma:
 *  1. Entry: "Ready to award?" with 4 paths
 *  2. Start with AI: prompt input + suggestion prompts
 *  3. AI optimization plan: rules + approve
 *  4. Explore scenarios: preset list (Lowest bidder, Best cost, etc.)
 *  5. Scenario view — Overview tab: KPIs + donut chart + supplier breakdown
 *  6. Scenario view — Allocation tab: item table with supplier columns
 *  7. All to one: select a single supplier
 *  8. Start from scratch: empty allocation table
 */
import { useState } from 'react'
import {
  Stack, Row, H1, H2, H3, Text, Button, Card, Divider, Badge, Tag,
  Spacer, Tabs, PillToggle, MetricPill, AllocationBar, PriceDelta,
} from '../components'
import { AIThinking } from '../components/AI'

// ─── Fake data ──────────────────────────────────────

const ITEMS = [
  { num: 53, name: 'Transmission Fluid', part: 'TF-431', vol: '9,000', baseline: '$30.00', alloc: 4.5 },
  { num: 44, name: 'Air Filter', part: 'AF-123', vol: '15,000', baseline: '$12.00', alloc: 3 },
  { num: 49, name: 'Clutch Kit', part: 'CK-998', vol: '2,000', baseline: '$250.00', alloc: 6 },
  { num: 51, name: 'Headlight', part: 'HL-321', vol: '4,800', baseline: '$90.00', alloc: 5 },
  { num: 48, name: 'Timing Belt', part: 'TB-777', vol: '7,500', baseline: '$75.00', alloc: 4 },
  { num: 50, name: 'Oil Filter', part: 'OF-555', vol: '18,000', baseline: '$15.00', alloc: 3.5 },
  { num: 46, name: 'Fuel Pump', part: 'FP-455', vol: '5,000', baseline: '$120.00', alloc: 7 },
]

const SUPPLIERS = [
  { name: 'Ahonda Co.', rfq: 'RFQ 12-23-25' },
  { name: 'Clos Supplier', rfq: 'RFQ 12-23-25' },
  { name: 'MechParts Inc.', rfq: 'RFQ 12-20-25' },
]

const SUPPLIER_PRICES = [
  { price: '$31.00', delta: '4%', lead: '3 weeks' },
  { price: '$12.50', delta: '4%', lead: '2 weeks' },
  { price: '$260.00', delta: '5%', lead: '6 weeks' },
  { price: '$92.00', delta: '4%', lead: '5 weeks' },
  { price: '$77.00', delta: '3.5%', lead: '4 weeks' },
  { price: '$15.50', delta: '4%', lead: '2 weeks' },
  { price: '$125.00', delta: '6%', lead: '5 weeks' },
]

const PRESETS = [
  { id: 'lowest', name: 'Lowest bidder', cost: '$15.8k', delta: '7%' },
  { id: 'best', name: 'Best cost', cost: '$15.8k', delta: '7%' },
  { id: 'two', name: 'Two suppliers', cost: '$15.8k', delta: '7%' },
  { id: 'lead', name: 'Best lead time', cost: '$15.8k', delta: '7%' },
]

const PROMPT_SUGGESTIONS = [
  'Prioritize incumbent suppliers for all items, unless a challenger provides a savings of more than [10%].',
  'Exclude specific suppliers (e.g., [Supplier A] and [Supplier B]) from consideration and award the remaining business to the cheapest available options.',
  'Award specific volume to a preferred vendor (e.g., Award 60% to [Supplier Name]) and distribute the remainder to the best-cost challengers.',
]

const AI_RULES = [
  { title: 'Demand Fulfillment', desc: 'All awarded quantities must add up to 100% of the RFQ demand.' },
  { title: 'Supplier Capacity', desc: 'No supplier can be awarded more than the quantity they said they can supply.' },
  { title: 'Top 10 Cost Filter', desc: 'Only the 10 lowest-cost suppliers can be considered, unless they cannot meet the full demand.' },
  { title: 'Lead Time Optimization', desc: 'Allocate demand to minimize overall lead time while keeping total cost close to the lowest possible.' },
]

// ─── Shared sub-bar with 4 entry method icons ───────

function MethodBar({ active, onSelect }) {
  const methods = [
    { id: 'ai', label: 'Start with AI' },
    { id: 'explore', label: 'Explore scenarios' },
    { id: 'one', label: 'Award all to one' },
    { id: 'scratch', label: 'Start from scratch' },
  ]
  return (
    <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
      {methods.map(m => (
        <button
          key={m.id}
          onClick={() => onSelect(m.id)}
          style={{
            flex: 1,
            padding: '14px 12px 12px',
            fontSize: 12,
            fontWeight: active === m.id ? 600 : 400,
            color: active === m.id ? 'var(--fg)' : 'var(--fg-3)',
            background: active === m.id ? 'var(--surface)' : 'transparent',
            border: 'none',
            borderBottom: active === m.id ? '2px solid var(--fg)' : '2px solid transparent',
            cursor: 'pointer',
            fontFamily: 'inherit',
            textAlign: 'center',
          }}
        >{m.label}</button>
      ))}
    </div>
  )
}

// ─── Entry Screen ───────────────────────────────────

function EntryScreen({ onSelect }) {
  return (
    <div style={{ textAlign: 'center', padding: '80px 0 40px' }}>
      <H1 style={{ fontSize: 24, marginBottom: 8 }}>Ready to award this project?</H1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--md)', maxWidth: 640, margin: '40px auto 0' }}>
        {[
          { id: 'ai', label: 'Start with AI', desc: 'Let AI analyze bids and suggest the best award.' },
          { id: 'explore', label: 'Explore scenarios', desc: 'Model different strategies to find the best fit.' },
          { id: 'one', label: 'All to one', desc: 'Quickly award the entire project to one supplier.' },
          { id: 'scratch', label: 'Start from scratch', desc: 'Manually assign each item to a supplier.' },
        ].map(opt => (
          <Card
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            style={{ cursor: 'pointer', padding: 'var(--lg) var(--md)', textAlign: 'center', transition: 'border-color 0.15s' }}
          >
            <Text style={{ display: 'block', fontWeight: 500, marginBottom: 6 }}>{opt.label}</Text>
            <Text muted size={12} style={{ lineHeight: 1.4 }}>{opt.desc}</Text>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Start with AI ──────────────────────────────────

function AIPromptScreen({ onGenerate }) {
  const [prompt, setPrompt] = useState('')

  return (
    <div style={{ maxWidth: 560, margin: '40px auto' }}>
      <Stack gap="lg" style={{ textAlign: 'center' }}>
        <div>
          <H1 style={{ fontSize: 22 }}>Build your custom award scenario</H1>
          <Text muted>Use category intelligence and project details for a best-practice setup</Text>
        </div>

        <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--surface)', overflow: 'hidden' }}>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Award to the lowest cost...."
            rows={4}
            style={{ width: '100%', border: 'none', outline: 'none', padding: 'var(--md)', fontSize: 13, fontFamily: 'inherit', resize: 'none', background: 'transparent' }}
          />
          <Row style={{ padding: '8px var(--md)', borderTop: '1px solid var(--border)' }}>
            <Text muted size={12}>Suggestions</Text>
            <Spacer />
            <button
              onClick={() => onGenerate(prompt || 'Select the 10 cheapest suppliers, then allocate demand to minimize lead time while meeting demand and respecting supplier capacity.')}
              style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'var(--accent)', color: 'var(--accent-fg)', cursor: 'pointer', fontSize: 16 }}
            >↑</button>
          </Row>
        </div>

        <div style={{ textAlign: 'left' }}>
          <Row gap="sm" style={{ marginBottom: 'var(--md)' }}>
            <Text muted size={12}>Prompt suggestions</Text>
            <Text size={12} style={{ color: 'var(--orange)' }}>12 suppliers</Text>
          </Row>
          <Stack gap="sm">
            {PROMPT_SUGGESTIONS.map((s, i) => (
              <div
                key={i}
                onClick={() => setPrompt(s)}
                style={{ padding: '10px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer', fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.5 }}
              >{s}</div>
            ))}
          </Stack>
        </div>
      </Stack>
    </div>
  )
}

// ─── AI Optimization Plan ───────────────────────────

function AIPlanScreen({ prompt, onApprove }) {
  return (
    <div style={{ maxWidth: 620, margin: '20px auto' }}>
      <Row justify="flex-end" style={{ marginBottom: 'var(--lg)' }}>
        <Button onClick={onApprove}>Approve and start →</Button>
      </Row>

      <Stack gap="lg">
        <H2>Award optimization plan</H2>

        <Stack gap="sm">
          <Row gap="sm">
            <Text muted size={12} style={{ fontWeight: 500 }}>Prompt summary</Text>
          </Row>
          <div style={{ padding: '10px 14px', background: 'var(--bg)', borderRadius: 'var(--radius)', fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.5 }}>
            {prompt}
          </div>
          <Card style={{ padding: 'var(--md)', position: 'relative' }}>
            <Text size={13} style={{ lineHeight: 1.6, color: 'var(--fg-2)' }}>
              Evaluate all supplier quotes from the RFQ and rank them by total cost. Keep only the 10 cheapest suppliers, then choose an award allocation that meets total demand while minimizing lead time as much as possible without significantly increasing cost. If multiple allocations have similar lead times, prefer the one with the lowest overall cost.
            </Text>
          </Card>
        </Stack>

        <Divider />

        <Stack gap="md">
          <H3>Rules</H3>
          {AI_RULES.map((rule, i) => (
            <div key={i}>
              <Text style={{ fontWeight: 600, display: 'block', marginBottom: 2 }}>{i + 1}. {rule.title}</Text>
              <Text muted size={13} style={{ lineHeight: 1.5 }}>{rule.desc}</Text>
            </div>
          ))}
        </Stack>
      </Stack>
    </div>
  )
}

// ─── Explore Scenarios (presets) ────────────────────

function ExploreScreen({ onSelectPreset }) {
  return (
    <div style={{ maxWidth: 560, margin: '40px auto' }}>
      <Stack gap="lg" style={{ textAlign: 'center' }}>
        <div>
          <H1 style={{ fontSize: 24, marginBottom: 8 }}>Ready to award this project?</H1>
        </div>

        <Row gap="sm" justify="center">
          <Text muted size={12}>QUICK START</Text>
          <Text size={12} style={{ color: 'var(--orange)' }}>12 suppliers</Text>
        </Row>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--sm)' }}>
          {PRESETS.map(p => (
            <Card key={p.id} onClick={() => onSelectPreset(p)} style={{ cursor: 'pointer', textAlign: 'center', padding: 'var(--md)' }}>
              <Text style={{ fontWeight: 600, display: 'block' }}>{p.name}</Text>
              <Row gap="xs" justify="center" style={{ marginTop: 4 }}>
                <Text size={12}>{p.cost}</Text>
                <PriceDelta value={p.delta} />
              </Row>
            </Card>
          ))}
        </div>

        <Stack gap="sm">
          {PRESETS.map(p => (
            <div
              key={p.id}
              onClick={() => onSelectPreset(p)}
              style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
            >
              <Text style={{ fontWeight: 500 }}>{p.name}</Text>
              <Row gap="sm">
                <Text>{p.cost}</Text>
                <PriceDelta value={p.delta} />
              </Row>
            </div>
          ))}
        </Stack>
      </Stack>
    </div>
  )
}

// ─── All to one supplier ────────────────────────────

function AllToOneScreen({ onSelect }) {
  return (
    <div style={{ maxWidth: 480, margin: '40px auto' }}>
      <Stack gap="lg">
        <div style={{ textAlign: 'center' }}>
          <H2>Award entire project to one supplier</H2>
          <Text muted>Select the supplier to receive all items.</Text>
        </div>

        {SUPPLIERS.map((s, i) => (
          <Card key={i} onClick={() => onSelect(s)} style={{ cursor: 'pointer', padding: 'var(--md)' }}>
            <Row>
              <div>
                <Text style={{ fontWeight: 500, display: 'block' }}>{s.name}</Text>
                <Text muted size={12}>{s.rfq}</Text>
              </div>
              <Spacer />
              <Button variant="secondary" style={{ fontSize: 12, height: 28 }}>Select</Button>
            </Row>
          </Card>
        ))}
      </Stack>
    </div>
  )
}

// ─── Scenario View — Overview ───────────────────────

function OverviewTab({ scenario }) {
  return (
    <Row gap="lg" align="flex-start">
      {/* Left metrics sidebar */}
      <div style={{ width: 200, flexShrink: 0 }}>
        <Stack gap="lg">
          <div>
            <Text muted size={11}>Spend & savings</Text>
            <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--fg)', marginTop: 2 }}>$37.7M</div>
            <Text size={12} style={{ color: 'var(--green)' }}>↓ 4.5%</Text>
            <Text size={12} style={{ color: 'var(--green)', marginLeft: 6 }}>$1.2M savings</Text>
          </div>
          <Divider />
          <div>
            <Text muted size={11}>Items awarded</Text>
            <div style={{ fontSize: 20, fontWeight: 600, marginTop: 2 }}>45 / 50</div>
            <Text muted size={12}>Bid coverage: 90%</Text>
          </div>
          <Divider />
          <div>
            <Text muted size={11}>Suppliers</Text>
            <div style={{ fontSize: 20, fontWeight: 600, marginTop: 2 }}>7</div>
            <Text muted size={12}>total spend</Text>
          </div>
          <Divider />
          <div>
            <Text muted size={11}>Lead time</Text>
            <div style={{ fontSize: 20, fontWeight: 600, marginTop: 2 }}>24wk max</div>
            <Text muted size={12}>Range: 2 days - 60 weeks</Text>
          </div>
        </Stack>
      </div>

      {/* Main chart area */}
      <div style={{ flex: 1 }}>
        <Stack gap="lg">
          <H3>Spend & Savings vs baseline</H3>

          {/* Donut chart placeholder */}
          <Row gap="lg" align="flex-start">
            <div style={{ position: 'relative', width: 160, height: 160 }}>
              <svg viewBox="0 0 160 160" style={{ width: 160, height: 160 }}>
                <circle cx="80" cy="80" r="60" fill="none" stroke="#eee" strokeWidth="24" />
                <circle cx="80" cy="80" r="60" fill="none" stroke="var(--orange)" strokeWidth="24"
                  strokeDasharray={`${0.95 * 377} ${0.05 * 377}`}
                  strokeDashoffset="94"
                  strokeLinecap="round"
                />
                <circle cx="80" cy="80" r="60" fill="none" stroke="#111" strokeWidth="24"
                  strokeDasharray={`${0.05 * 377} ${0.95 * 377}`}
                  strokeDashoffset={`${94 - 0.95 * 377}`}
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <Stack gap="sm" style={{ paddingTop: 12 }}>
              <div>
                <Text muted size={11}>Baseline</Text>
                <div style={{ fontSize: 16, fontWeight: 600 }}>$38,000,000</div>
              </div>
              <Row gap="sm">
                <div style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--orange)' }} />
                <div>
                  <Text muted size={11}>Actual spend</Text>
                  <div style={{ fontWeight: 600 }}>$37.1M</div>
                </div>
              </Row>
              <Row gap="sm">
                <div style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--green)' }} />
                <div>
                  <Text muted size={11}>Savings</Text>
                  <div style={{ fontWeight: 600, color: 'var(--green)' }}>$2.1M</div>
                </div>
              </Row>
            </Stack>
          </Row>

          <Divider />

          {/* Supplier bar breakdown */}
          <div>
            <Text muted size={11} style={{ display: 'block', marginBottom: 'var(--sm)' }}>Unit price savings vs baseline</Text>
            <Stack gap="md">
              {[
                { name: 'Innovatech Corp', avg: '-14.1%', items: [
                  { name: 'Ergonomic Desk Chair', base: '$365.00', award: '$312.50', delta: '-$52.50' },
                  { name: 'Mesh Task Chair', base: '$310.00', award: '$267.00', delta: '-$43.00' },
                ]},
                { name: 'Ahonda Co.', avg: '-8.2%', items: [
                  { name: 'Oil Filter OF-555', base: '$15.00', award: '$14.20', delta: '-$0.80' },
                ]},
              ].map((supplier, si) => (
                <div key={si}>
                  <Row style={{ marginBottom: 6 }}>
                    <Row gap="xs">
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: si === 0 ? '#6366f1' : 'var(--orange)' }} />
                      <Text style={{ fontWeight: 500 }}>{supplier.name}</Text>
                    </Row>
                    <Spacer />
                    <Text size={12} style={{ color: 'var(--green)' }}>avg {supplier.avg} / unit</Text>
                  </Row>
                  {/* savings bar */}
                  <div style={{ height: 6, borderRadius: 3, background: '#eee', marginBottom: 8 }}>
                    <div style={{
                      height: '100%',
                      borderRadius: 3,
                      width: si === 0 ? '75%' : '45%',
                      background: si === 0 ? 'linear-gradient(90deg, #6366f1, #22c55e)' : 'linear-gradient(90deg, var(--orange), #22c55e)',
                    }} />
                  </div>
                  {/* item breakdown */}
                  <div style={{ fontSize: 12 }}>
                    <Row style={{ color: 'var(--fg-3)', marginBottom: 4 }}>
                      <span style={{ flex: 2 }}>Item</span>
                      <span style={{ width: 70, textAlign: 'right' }}>Baseline</span>
                      <span style={{ width: 70, textAlign: 'right' }}>Awarded</span>
                      <span style={{ width: 70, textAlign: 'right' }}>Δ / unit</span>
                    </Row>
                    {supplier.items.map((item, ii) => (
                      <Row key={ii} style={{ padding: '4px 0', borderTop: '1px solid var(--border)' }}>
                        <span style={{ flex: 2 }}>{item.name}</span>
                        <span style={{ width: 70, textAlign: 'right' }}>{item.base}</span>
                        <span style={{ width: 70, textAlign: 'right' }}>{item.award}</span>
                        <span style={{ width: 70, textAlign: 'right', color: 'var(--green)', fontWeight: 500 }}>{item.delta}</span>
                      </Row>
                    ))}
                  </div>
                </div>
              ))}
            </Stack>
          </div>
        </Stack>
      </div>
    </Row>
  )
}

// ─── Scenario View — Allocation Table ───────────────

function AllocationTab() {
  return (
    <Stack gap="md">
      <Text muted size={12}>Adjust the supplier and property view for the table below by adjusting the filters. Select an item row to allocate volume.</Text>

      <Row gap="sm">
        <Tag>Suppliers 3 <span style={{ opacity: 0.5, cursor: 'pointer' }}>x</span></Tag>
        <Tag>Properties 3 <span style={{ opacity: 0.5, cursor: 'pointer' }}>x</span></Tag>
      </Row>

      {/* Wide scrollable table */}
      <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'auto', background: 'var(--surface)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900, fontSize: 12 }}>
          <thead>
            <tr>
              <th style={th}>#</th>
              <th style={{ ...th, minWidth: 140 }}>Item name<br /><span style={{ fontWeight: 400, color: 'var(--fg-3)' }}>Item number</span></th>
              <th style={{ ...th, textAlign: 'right' }}>Volume</th>
              <th style={{ ...th, textAlign: 'right' }}>Baseline</th>
              <th style={{ ...th, minWidth: 120 }}>Allocation</th>
              <th style={{ ...th, borderLeft: '2px solid var(--border)', textAlign: 'right' }}>
                <div>Ahonda Co.</div>
                <div style={{ fontWeight: 400, color: 'var(--fg-3)', fontSize: 11 }}>RFQ 12-23-25</div>
              </th>
              <th style={{ ...th, textAlign: 'right' }}>Price</th>
              <th style={{ ...th }}>Lead time</th>
              <th style={{ ...th, borderLeft: '2px solid var(--border)', textAlign: 'right' }}>
                <div>Clos Supplier</div>
                <div style={{ fontWeight: 400, color: 'var(--fg-3)', fontSize: 11 }}>RFQ 12-23-25</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {ITEMS.map((item, i) => {
              const sp = SUPPLIER_PRICES[i]
              return (
                <tr key={item.num} style={{ cursor: 'pointer' }}>
                  <td style={td}>{item.num}</td>
                  <td style={td}>
                    <div style={{ fontWeight: 500 }}>{item.name}</div>
                    <div style={{ color: 'var(--fg-3)', fontSize: 11 }}>{item.part}</div>
                  </td>
                  <td style={{ ...td, textAlign: 'right' }}>{item.vol}</td>
                  <td style={{ ...td, textAlign: 'right' }}>{item.baseline}</td>
                  <td style={td}>
                    <AllocationBar percent={item.alloc} />
                  </td>
                  <td style={{ ...td, borderLeft: '2px solid var(--border)', textAlign: 'right' }}>
                    <Row gap="xs" justify="flex-end">
                      <span>{sp.price}</span>
                      <PriceDelta value={sp.delta} />
                    </Row>
                  </td>
                  <td style={{ ...td, textAlign: 'right' }}>{sp.lead}</td>
                  <td style={td}>{sp.lead}</td>
                  <td style={{ ...td, borderLeft: '2px solid var(--border)', textAlign: 'right' }}>
                    {sp.price.replace('$', '$')}
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr>
              <td style={{ ...td, fontWeight: 600, borderBottom: 'none' }} colSpan={2}>30 items</td>
              <td style={{ ...td, fontWeight: 600, textAlign: 'right', borderBottom: 'none' }}>1,023,000</td>
              <td style={{ ...td, fontWeight: 600, textAlign: 'right', borderBottom: 'none' }}>$453,456.00</td>
              <td style={{ ...td, borderBottom: 'none' }}>$453,456.00</td>
              <td style={{ ...td, fontWeight: 600, textAlign: 'right', borderBottom: 'none', borderLeft: '2px solid var(--border)' }}>$453,456.00</td>
              <td style={{ ...td, borderBottom: 'none' }} colSpan={3}></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Stack>
  )
}

const th = {
  padding: '8px 12px',
  borderBottom: '1px solid var(--border)',
  textAlign: 'left',
  fontSize: 11,
  fontWeight: 500,
  color: 'var(--fg-2)',
  whiteSpace: 'nowrap',
  verticalAlign: 'bottom',
}
const td = {
  padding: '10px 12px',
  borderBottom: '1px solid var(--border)',
  fontSize: 12,
  whiteSpace: 'nowrap',
}


// ─── Scenario View (wraps Overview + Allocation) ────

function ScenarioView({ scenario, onBack }) {
  const [viewTab, setViewTab] = useState('overview')

  return (
    <Stack gap="md">
      {/* Scenario card */}
      <Card style={{ padding: 'var(--md)', display: 'inline-flex', alignSelf: 'flex-start', gap: 12 }}>
        <div>
          <Row gap="sm">
            <Text muted size={11}>Created 03/12/26</Text>
            <Badge>Draft</Badge>
          </Row>
          <Text style={{ fontWeight: 600, display: 'block', marginTop: 2 }}>{scenario.name}</Text>
          <Row gap="sm" style={{ marginTop: 2 }}>
            <Text size={12}>{scenario.cost || '$15.8k'}</Text>
            <PriceDelta value={scenario.delta || '7%'} />
          </Row>
        </div>
      </Card>

      {/* Scenario header */}
      <Row>
        <H2>{scenario.name}</H2>
        <Spacer />
        <Row gap="sm">
          <MetricPill label="Total spend" value="$37.7M" />
          <MetricPill label="Total savings" value="$1.7M" color="var(--green)" />
          <MetricPill label="Bid coverage" value="90%" />
        </Row>
        <Row gap="sm" style={{ marginLeft: 'var(--md)' }}>
          <Button variant="secondary">Manage ▾</Button>
          <Button>Submit award</Button>
        </Row>
      </Row>

      <Text muted size={12}>
        {scenario.desc || 'This scenario is generated to award the lowest cost item across any # of suppliers.'}
        {scenario.ai && <span style={{ color: 'var(--orange)', marginLeft: 8, cursor: 'pointer' }}>View AI context</span>}
      </Text>

      <Divider />

      {/* Overview / Allocation toggle */}
      <Row>
        <H3>{viewTab === 'overview' ? 'Scenario overview' : 'Award allocation'}</H3>
        <Spacer />
        <PillToggle options={['Overview', 'Allocation']} active={viewTab === 'overview' ? 'Overview' : 'Allocation'} onChange={v => setViewTab(v === 'Overview' ? 'overview' : 'allocation')} />
      </Row>

      <Text muted size={12}>
        Adjust the supplier and property view for the table below by adjusting the filters. Select an item row to allocate volume.
      </Text>

      {viewTab === 'overview' ? <OverviewTab scenario={scenario} /> : <AllocationTab />}
    </Stack>
  )
}


// ═══════════════════════════════════════════════════
// Main Award Flow
// ═══════════════════════════════════════════════════

export default function AwardFlow() {
  // screen: entry | ai_prompt | ai_plan | explore | one | scratch | scenario
  const [screen, setScreen] = useState('entry')
  const [method, setMethod] = useState(null)
  const [scenario, setScenario] = useState(null)
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  const handleMethodSelect = (id) => {
    setMethod(id)
    setScreen(id === 'ai' ? 'ai_prompt' : id === 'explore' ? 'explore' : id === 'one' ? 'one' : 'scratch')
  }

  const handleAIGenerate = (prompt) => {
    setAiPrompt(prompt)
    setScreen('ai_plan')
  }

  const handleAIApprove = () => {
    setAiLoading(true)
    setTimeout(() => {
      setAiLoading(false)
      setScenario({ name: 'Top 10 local priority', cost: '$15.8k', delta: '7%', ai: true, desc: 'Select the 10 cheapest suppliers, then allocate demand to minimize lead time while meeting demand and respecting supplier capacity.' })
      setScreen('scenario')
    }, 2000)
  }

  const handlePresetSelect = (preset) => {
    setScenario({ name: preset.name, cost: preset.cost, delta: preset.delta, ai: false, desc: `This scenario is generated to award the lowest cost item across any # of suppliers.` })
    setScreen('scenario')
  }

  const handleOneSupplier = (supplier) => {
    setScenario({ name: `One supplier — ${supplier.name}`, cost: '$15.8k', delta: '7%', ai: false })
    setScreen('scenario')
  }

  const handleScratch = () => {
    setScenario({ name: 'New scenario 12-30-26', cost: '—', delta: '—', ai: false, desc: '' })
    setScreen('scenario')
  }

  // For non-entry screens, show the method bar
  const showMethodBar = screen !== 'entry'

  return (
    <Stack gap="md" style={{ margin: '-40px -24px 0', minHeight: '100vh' }}>
      {/* Top bar */}
      <div style={{ padding: '12px var(--lg)', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <Row>
          <Text muted size={12}>AWARD SCENARIOS</Text>
          <Spacer />
          {screen !== 'entry' && (
            <Button variant="ghost" style={{ fontSize: 12 }} onClick={() => { setScreen('entry'); setMethod(null); setScenario(null) }}>
              ✕ Close
            </Button>
          )}
        </Row>
      </div>

      {showMethodBar && (
        <div style={{ margin: '0 var(--lg)' }}>
          <MethodBar active={method} onSelect={handleMethodSelect} />
        </div>
      )}

      <div style={{ padding: '0 var(--lg)', paddingBottom: 'var(--xl)' }}>
        {screen === 'entry' && <EntryScreen onSelect={handleMethodSelect} />}
        {screen === 'ai_prompt' && <AIPromptScreen onGenerate={handleAIGenerate} />}
        {screen === 'ai_plan' && !aiLoading && <AIPlanScreen prompt={aiPrompt} onApprove={handleAIApprove} />}
        {screen === 'ai_plan' && aiLoading && (
          <div style={{ padding: '80px 0', textAlign: 'center' }}>
            <AIThinking label="Generating optimal award allocation..." />
          </div>
        )}
        {screen === 'explore' && <ExploreScreen onSelectPreset={handlePresetSelect} />}
        {screen === 'one' && <AllToOneScreen onSelect={handleOneSupplier} />}
        {screen === 'scratch' && !scenario && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Button onClick={handleScratch}>Create blank scenario</Button>
          </div>
        )}
        {screen === 'scenario' && scenario && (
          <ScenarioView scenario={scenario} onBack={() => { setScreen('entry'); setScenario(null) }} />
        )}
      </div>
    </Stack>
  )
}
