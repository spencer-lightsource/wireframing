/**
 * Example flow — copy this file to create new flows.
 *
 * Each flow is a multi-step wizard. Define your steps as components,
 * then wire them into the `steps` array. The FlowSteps component
 * renders the progress indicator, and you control navigation with
 * simple state.
 */
import { useState } from 'react'
import {
  Stack, Row, H1, H2, Text, Button, Input, Select, Textarea,
  Card, Divider, Table, Badge, FlowSteps, Checkbox, EmptyState,
} from '../components'

const STEPS = ['Configure', 'Review', 'Done']

function Step1({ data, onChange, onNext }) {
  return (
    <Stack gap="lg">
      <div>
        <H2>Configure your workspace</H2>
        <Text muted>Set up the basic parameters for this workflow.</Text>
      </div>

      <Card>
        <Stack gap="md">
          <Input label="Workspace name" placeholder="e.g. Production" value={data.name} onChange={e => onChange({ name: e.target.value })} />
          <Select label="Environment" options={['Development', 'Staging', 'Production']} value={data.env} onChange={e => onChange({ env: e.target.value })} />
          <Textarea label="Description (optional)" placeholder="What is this workspace for?" value={data.desc} onChange={e => onChange({ desc: e.target.value })} />
          <Checkbox label="Enable advanced mode" checked={data.advanced} onChange={e => onChange({ advanced: e.target.checked })} />
        </Stack>
      </Card>

      <Row justify="flex-end">
        <Button onClick={onNext}>Continue</Button>
      </Row>
    </Stack>
  )
}

function Step2({ data, onBack, onNext }) {
  return (
    <Stack gap="lg">
      <div>
        <H2>Review</H2>
        <Text muted>Confirm your configuration before creating.</Text>
      </div>

      <Card>
        <Stack gap="sm">
          <Row justify="space-between"><Text muted>Name</Text><Text>{data.name || '—'}</Text></Row>
          <Divider />
          <Row justify="space-between"><Text muted>Environment</Text><Badge>{data.env}</Badge></Row>
          <Divider />
          <Row justify="space-between"><Text muted>Advanced mode</Text><Text>{data.advanced ? 'On' : 'Off'}</Text></Row>
        </Stack>
      </Card>

      <Row gap="sm" justify="flex-end">
        <Button variant="secondary" onClick={onBack}>Back</Button>
        <Button onClick={onNext}>Create workspace</Button>
      </Row>
    </Stack>
  )
}

function Step3() {
  return (
    <Stack gap="lg" style={{ textAlign: 'center', paddingTop: 'var(--xl)' }}>
      <H2>Workspace created</H2>
      <Text muted>Your workspace is ready. You can now start adding resources.</Text>
      <Row justify="center" gap="sm">
        <Button variant="secondary">Go to dashboard</Button>
        <Button>Add first resource</Button>
      </Row>
    </Stack>
  )
}

export default function ExampleFlow() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState({ name: '', env: 'Development', desc: '', advanced: false })

  const update = (patch) => setData(prev => ({ ...prev, ...patch }))

  return (
    <Stack gap="lg">
      <H1>Create Workspace</H1>
      <FlowSteps steps={STEPS} current={step} />
      <Divider />

      {step === 0 && <Step1 data={data} onChange={update} onNext={() => setStep(1)} />}
      {step === 1 && <Step2 data={data} onBack={() => setStep(0)} onNext={() => setStep(2)} />}
      {step === 2 && <Step3 />}
    </Stack>
  )
}
