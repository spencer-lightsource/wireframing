import { useState } from 'react'
import {
  Stack, Row, H1, H2, H3, Text, Button, Input, Select, Textarea,
  Card, Divider, Table, Badge, FlowSteps, Checkbox, Tag, Spacer,
  KV, Modal, EmptyState, Tabs,
} from '../components'
import { AIInput, AIThinking, AISuggestion, useAI } from '../components/AI'

const STEPS = ['Create', 'Parts', 'Suppliers', 'Timeline', 'Review & Send']

// ─── Mock data generators (simulate AI output) ─────

const aiExtractProject = (prompt) => ({
  name: prompt.length > 30 ? prompt.slice(0, 40) + '...' : 'Custom PCB Assembly',
  category: 'Electronics > PCB Assembly',
  volume: '5,000 units',
  specs: [
    { key: 'Material', value: 'FR-4' },
    { key: 'Layers', value: '4-layer' },
    { key: 'Solder', value: 'Lead-free (RoHS)' },
    { key: 'Surface Finish', value: 'ENIG' },
  ],
  summary: 'RFQ for custom 4-layer PCB assemblies. Volume: 5,000 units. Requires RoHS compliance and ENIG surface finish.',
})

const aiExtractParts = () => [
  { id: 1, name: 'Main PCB Assembly', qty: '5,000', spec: '4-layer FR-4, 1.6mm, ENIG', unit: 'ea', ai: false },
  { id: 2, name: 'SMT Stencil', qty: '2', spec: 'Laser-cut, 0.12mm thickness', unit: 'ea', ai: true },
  { id: 3, name: 'Tooling & Fixtures', qty: '1', spec: 'Test jig for ICT', unit: 'set', ai: true },
]

const aiSuggestSuppliers = () => [
  { id: 1, name: 'Apex Circuits', location: 'Shenzhen, CN', certs: ['ISO 9001', 'IATF 16949'], score: 94, match: 'Strong' },
  { id: 2, name: 'NovaPCB', location: 'Taipei, TW', certs: ['ISO 9001', 'UL'], score: 89, match: 'Strong' },
  { id: 3, name: 'CircuitWorks USA', location: 'San Jose, US', certs: ['ISO 9001', 'IPC'], score: 82, match: 'Good' },
  { id: 4, name: 'EuroBoard GmbH', location: 'Munich, DE', certs: ['ISO 9001', 'ISO 14001'], score: 78, match: 'Good' },
  { id: 5, name: 'PrecisionPCB', location: 'Penang, MY', certs: ['ISO 9001'], score: 71, match: 'Fair' },
]

const aiSuggestTimeline = () => ({
  sent: '2026-03-25',
  questionsBy: '2026-03-28',
  quotesBy: '2026-04-08',
  awardBy: '2026-04-15',
  productionStart: '2026-05-01',
  warning: 'Qingming Festival (Apr 4-6) falls within the quoting window. Consider extending the deadline by 2 days.',
})


// ═══════════════════════════════════════════════════
// Step 1: Create with AI
// ═══════════════════════════════════════════════════

function StepCreate({ data, onChange, onNext }) {
  const [prompt, setPrompt] = useState('')
  const ai = useAI(aiExtractProject, 1800)

  const handleGenerate = () => {
    if (prompt.trim()) ai.run(prompt)
  }

  const project = ai.result

  return (
    <Stack gap="lg">
      <div>
        <H2>Describe what you're sourcing</H2>
        <Text muted>Tell us what you need in plain language. AI will structure the project for you.</Text>
      </div>

      <AIInput
        value={prompt}
        onChange={setPrompt}
        onSubmit={handleGenerate}
        placeholder={"e.g. We need to source custom 4-layer PCB assemblies for our IoT sensor. 5,000 units, FR-4 material, lead-free solder, ENIG finish. Need suppliers with ISO 9001 and RoHS compliance."}
        loading={ai.loading}
        buttonLabel="Create project"
      />

      {ai.loading && <AIThinking label="Extracting project details..." />}

      {project && (
        <Card>
          <Stack gap="md">
            <Row gap="sm">
              <Badge style={{ background: 'var(--accent)', color: 'var(--accent-fg)', border: 'none' }}>AI Generated</Badge>
              <Text muted size={12}>Review and edit as needed</Text>
            </Row>

            <Input
              label="Project name"
              value={data.name || project.name}
              onChange={e => onChange({ name: e.target.value })}
            />

            <Row gap="md">
              <div style={{ flex: 1 }}>
                <Input
                  label="Category"
                  value={data.category || project.category}
                  onChange={e => onChange({ category: e.target.value })}
                />
              </div>
              <div style={{ flex: 1 }}>
                <Input
                  label="Estimated volume"
                  value={data.volume || project.volume}
                  onChange={e => onChange({ volume: e.target.value })}
                />
              </div>
            </Row>

            <Divider />

            <H3>Extracted specifications</H3>
            {(data.specs || project.specs).map((s, i) => (
              <Row key={i} gap="md">
                <div style={{ flex: 1 }}>
                  <Input value={s.key} onChange={e => {
                    const specs = [...(data.specs || project.specs)]
                    specs[i] = { ...specs[i], key: e.target.value }
                    onChange({ specs })
                  }} />
                </div>
                <div style={{ flex: 1 }}>
                  <Input value={s.value} onChange={e => {
                    const specs = [...(data.specs || project.specs)]
                    specs[i] = { ...specs[i], value: e.target.value }
                    onChange({ specs })
                  }} />
                </div>
              </Row>
            ))}
            <Button variant="ghost" style={{ alignSelf: 'flex-start', fontSize: 13, height: 28 }}
              onClick={() => onChange({ specs: [...(data.specs || project.specs), { key: '', value: '' }] })}>
              + Add spec
            </Button>

            <Divider />

            <Textarea
              label="Summary"
              value={data.summary || project.summary}
              onChange={e => onChange({ summary: e.target.value })}
              rows={2}
            />
          </Stack>
        </Card>
      )}

      <Row justify="flex-end">
        <Button onClick={onNext} disabled={!project}>Continue to parts</Button>
      </Row>
    </Stack>
  )
}


// ═══════════════════════════════════════════════════
// Step 2: Parts / Line Items
// ═══════════════════════════════════════════════════

function StepParts({ data, onChange, onBack, onNext }) {
  const [parts, setParts] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const ai = useAI(aiExtractParts, 1200)

  // Auto-generate on mount if no parts yet
  if (!parts && !ai.loading && !ai.result) {
    ai.run()
  }
  if (ai.result && !parts) {
    setParts(ai.result)
  }

  const removePart = (id) => setParts(prev => prev.filter(p => p.id !== id))
  const addPart = () => {
    const newId = Math.max(0, ...(parts || []).map(p => p.id)) + 1
    setParts(prev => [...(prev || []), { id: newId, name: '', qty: '', spec: '', unit: 'ea', ai: false }])
  }

  return (
    <Stack gap="lg">
      <div>
        <H2>Parts & line items</H2>
        <Text muted>AI extracted these from your project description. Edit, add, or remove as needed.</Text>
      </div>

      {ai.loading && <AIThinking label="Extracting parts from project description..." />}

      {parts && (
        <>
          {/* AI-suggested items get a subtle callout */}
          {parts.some(p => p.ai) && (
            <AISuggestion
              title="Additional items suggested"
              onAccept={() => {}}
              onDismiss={() => setParts(prev => prev.filter(p => !p.ai))}
            >
              AI added {parts.filter(p => p.ai).length} items you may need based on your specs (stencils, tooling). Accept to keep or dismiss to remove.
            </AISuggestion>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sm)' }}>
            {parts.map((part) => (
              <Card key={part.id} style={{ padding: 'var(--md)' }}>
                <Row gap="md" align="flex-start">
                  <div style={{ flex: 2 }}>
                    <Input label="Part name" value={part.name} onChange={e => {
                      setParts(prev => prev.map(p => p.id === part.id ? { ...p, name: e.target.value } : p))
                    }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Input label="Qty" value={part.qty} onChange={e => {
                      setParts(prev => prev.map(p => p.id === part.id ? { ...p, qty: e.target.value } : p))
                    }} />
                  </div>
                  <div style={{ flex: 2 }}>
                    <Input label="Specification" value={part.spec} onChange={e => {
                      setParts(prev => prev.map(p => p.id === part.id ? { ...p, spec: e.target.value } : p))
                    }} />
                  </div>
                  <div style={{ paddingTop: 22 }}>
                    <Row gap="xs">
                      {part.ai && <Tag>AI</Tag>}
                      <Button variant="ghost" style={{ height: 28, fontSize: 12, color: 'var(--danger)' }}
                        onClick={() => removePart(part.id)}>Remove</Button>
                    </Row>
                  </div>
                </Row>
              </Card>
            ))}
          </div>

          <Row>
            <Button variant="secondary" onClick={addPart} style={{ fontSize: 13 }}>+ Add part</Button>
            <Button variant="ghost" style={{ fontSize: 13 }}>Upload BOM</Button>
          </Row>
        </>
      )}

      <Row gap="sm" justify="flex-end">
        <Button variant="secondary" onClick={onBack}>Back</Button>
        <Button onClick={onNext} disabled={!parts}>Continue to suppliers</Button>
      </Row>
    </Stack>
  )
}


// ═══════════════════════════════════════════════════
// Step 3: Suppliers
// ═══════════════════════════════════════════════════

function StepSuppliers({ data, onChange, onBack, onNext }) {
  const [suppliers, setSuppliers] = useState(null)
  const [selected, setSelected] = useState(new Set())
  const ai = useAI(aiSuggestSuppliers, 1400)

  if (!suppliers && !ai.loading && !ai.result) {
    ai.run()
  }
  if (ai.result && !suppliers) {
    setSuppliers(ai.result)
    setSelected(new Set(ai.result.filter(s => s.score >= 80).map(s => s.id)))
  }

  const toggle = (id) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <Stack gap="lg">
      <div>
        <H2>Select suppliers</H2>
        <Text muted>AI ranked suppliers by fit for your project. Select who to include in the RFQ.</Text>
      </div>

      {ai.loading && <AIThinking label="Finding best-fit suppliers..." />}

      {suppliers && (
        <>
          <Row gap="sm">
            <Text muted size={13}>{selected.size} of {suppliers.length} suppliers selected</Text>
            <Spacer />
            <Button variant="ghost" style={{ fontSize: 13, height: 28 }}
              onClick={() => setSelected(new Set(suppliers.map(s => s.id)))}>Select all</Button>
            <Button variant="ghost" style={{ fontSize: 13, height: 28 }}
              onClick={() => setSelected(new Set())}>Clear</Button>
          </Row>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sm)' }}>
            {suppliers.map(s => (
              <Card key={s.id}
                onClick={() => toggle(s.id)}
                style={{
                  padding: 'var(--md)',
                  cursor: 'pointer',
                  borderColor: selected.has(s.id) ? 'var(--accent)' : undefined,
                  borderWidth: selected.has(s.id) ? 2 : 1,
                }}>
                <Row gap="md">
                  <Checkbox checked={selected.has(s.id)} onChange={() => toggle(s.id)} />

                  <div style={{ flex: 1 }}>
                    <Row gap="sm">
                      <Text style={{ fontWeight: 500 }}>{s.name}</Text>
                      <Badge style={
                        s.match === 'Strong'
                          ? { background: '#e8f5e9', color: '#2e7d32', borderColor: '#c8e6c9' }
                          : {}
                      }>{s.score}% match</Badge>
                    </Row>
                    <Text muted size={13} style={{ display: 'block', marginTop: 2 }}>{s.location}</Text>
                  </div>

                  <Row gap="xs" style={{ flexWrap: 'wrap' }}>
                    {s.certs.map(c => <Tag key={c}>{c}</Tag>)}
                  </Row>
                </Row>
              </Card>
            ))}
          </div>

          <Button variant="secondary" style={{ alignSelf: 'flex-start', fontSize: 13 }}>
            + Add supplier manually
          </Button>
        </>
      )}

      <Row gap="sm" justify="flex-end">
        <Button variant="secondary" onClick={onBack}>Back</Button>
        <Button onClick={() => { onChange({ selectedSuppliers: selected.size }); onNext() }} disabled={selected.size === 0}>
          Continue to timeline
        </Button>
      </Row>
    </Stack>
  )
}


// ═══════════════════════════════════════════════════
// Step 4: Timeline
// ═══════════════════════════════════════════════════

function StepTimeline({ data, onChange, onBack, onNext }) {
  const [timeline, setTimeline] = useState(null)
  const ai = useAI(aiSuggestTimeline, 1000)

  if (!timeline && !ai.loading && !ai.result) {
    ai.run()
  }
  if (ai.result && !timeline) {
    setTimeline(ai.result)
  }

  const update = (key, val) => setTimeline(prev => ({ ...prev, [key]: val }))

  return (
    <Stack gap="lg">
      <div>
        <H2>Set timeline</H2>
        <Text muted>AI suggested dates based on your project scope and supplier lead times.</Text>
      </div>

      {ai.loading && <AIThinking label="Calculating optimal timeline..." />}

      {timeline && (
        <>
          {timeline.warning && (
            <AISuggestion
              title="Timeline advisory"
              onDismiss={() => setTimeline(prev => ({ ...prev, warning: null }))}
            >
              {timeline.warning}
            </AISuggestion>
          )}

          <Card>
            <Stack gap="md">
              <Row gap="md">
                <div style={{ flex: 1 }}>
                  <Input label="RFQ sent" type="date" value={timeline.sent} onChange={e => update('sent', e.target.value)} />
                </div>
                <div style={{ flex: 1 }}>
                  <Input label="Questions due" type="date" value={timeline.questionsBy} onChange={e => update('questionsBy', e.target.value)} />
                </div>
              </Row>
              <Row gap="md">
                <div style={{ flex: 1 }}>
                  <Input label="Quotes due" type="date" value={timeline.quotesBy} onChange={e => update('quotesBy', e.target.value)} />
                </div>
                <div style={{ flex: 1 }}>
                  <Input label="Award by" type="date" value={timeline.awardBy} onChange={e => update('awardBy', e.target.value)} />
                </div>
              </Row>
              <Input label="Production start" type="date" value={timeline.productionStart} onChange={e => update('productionStart', e.target.value)} />
            </Stack>
          </Card>

          {/* Visual timeline bar */}
          <Card style={{ padding: 'var(--md)' }}>
            <Text muted size={12} style={{ display: 'block', marginBottom: 'var(--sm)' }}>Timeline overview</Text>
            <div style={{ display: 'flex', gap: 2, height: 8, borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ flex: 1, background: '#1a1a1a', borderRadius: '4px 0 0 4px' }} title="RFQ open" />
              <div style={{ flex: 2, background: '#555' }} title="Quoting period" />
              <div style={{ flex: 1, background: '#999' }} title="Evaluation" />
              <div style={{ flex: 3, background: '#ddd', borderRadius: '0 4px 4px 0' }} title="Production" />
            </div>
            <Row justify="space-between" style={{ marginTop: 4 }}>
              <Text muted size={11}>Send</Text>
              <Text muted size={11}>Quotes due</Text>
              <Text muted size={11}>Award</Text>
              <Text muted size={11}>Production</Text>
            </Row>
          </Card>
        </>
      )}

      <Row gap="sm" justify="flex-end">
        <Button variant="secondary" onClick={onBack}>Back</Button>
        <Button onClick={onNext} disabled={!timeline}>Review & send</Button>
      </Row>
    </Stack>
  )
}


// ═══════════════════════════════════════════════════
// Step 5: Review & Send
// ═══════════════════════════════════════════════════

function StepReview({ data, onBack, onSend }) {
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSend = () => {
    setSending(true)
    setTimeout(() => { setSending(false); setSent(true) }, 2000)
  }

  if (sent) {
    return (
      <Stack gap="lg" style={{ textAlign: 'center', paddingTop: 'var(--xl)' }}>
        <H2>RFQ sent successfully</H2>
        <Text muted style={{ display: 'block' }}>
          Your RFQ has been sent to {data.selectedSuppliers || 3} suppliers. You'll be notified when quotes come in.
        </Text>
        <Row justify="center" gap="sm">
          <Button variant="secondary">View project</Button>
          <Button>Track responses</Button>
        </Row>
      </Stack>
    )
  }

  return (
    <Stack gap="lg">
      <div>
        <H2>Review your RFQ</H2>
        <Text muted>Everything looks good? Send it to your selected suppliers.</Text>
      </div>

      <Card>
        <Stack gap="sm">
          <KV label="Project" value={data.name || 'Custom PCB Assembly'} />
          <KV label="Category" value={data.category || 'Electronics > PCB Assembly'} />
          <KV label="Volume" value={data.volume || '5,000 units'} />
          <KV label="Suppliers" value={`${data.selectedSuppliers || 3} selected`} />
        </Stack>
      </Card>

      {data.specs && (
        <Card>
          <H3 style={{ marginBottom: 'var(--sm)' }}>Specifications</H3>
          <Stack gap="sm">
            {data.specs.map((s, i) => (
              <KV key={i} label={s.key} value={s.value} />
            ))}
          </Stack>
        </Card>
      )}

      <Card>
        <H3 style={{ marginBottom: 'var(--sm)' }}>What suppliers will see</H3>
        <div style={{
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: 'var(--md)',
          fontSize: 13,
          color: 'var(--fg-2)',
          lineHeight: 1.6,
        }}>
          <Text style={{ fontWeight: 500, display: 'block', marginBottom: 8 }}>
            RFQ: {data.name || 'Custom PCB Assembly'}
          </Text>
          {data.summary || 'RFQ for custom 4-layer PCB assemblies. Volume: 5,000 units. Requires RoHS compliance and ENIG surface finish.'}
          <br /><br />
          <Text muted size={12}>Includes: parts list, specifications, timeline, and submission instructions.</Text>
        </div>
      </Card>

      <Row gap="sm" justify="flex-end">
        <Button variant="secondary" onClick={onBack}>Back</Button>
        <Button onClick={handleSend} disabled={sending}>
          {sending ? 'Sending...' : 'Send RFQ to suppliers'}
        </Button>
      </Row>
    </Stack>
  )
}


// ═══════════════════════════════════════════════════
// Main Flow
// ═══════════════════════════════════════════════════

export default function SourcingProject() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState({})

  const update = (patch) => setData(prev => ({ ...prev, ...patch }))

  return (
    <Stack gap="lg">
      <H1>Sourcing Project</H1>
      <FlowSteps steps={STEPS} current={step} />
      <Divider />

      {step === 0 && <StepCreate data={data} onChange={update} onNext={() => setStep(1)} />}
      {step === 1 && <StepParts data={data} onChange={update} onBack={() => setStep(0)} onNext={() => setStep(2)} />}
      {step === 2 && <StepSuppliers data={data} onChange={update} onBack={() => setStep(1)} onNext={() => setStep(3)} />}
      {step === 3 && <StepTimeline data={data} onChange={update} onBack={() => setStep(2)} onNext={() => setStep(4)} />}
      {step === 4 && <StepReview data={data} onBack={() => setStep(3)} />}
    </Stack>
  )
}
