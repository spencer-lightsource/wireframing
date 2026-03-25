import { Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SaasLayout from './layouts/SaasLayout'
import FlowBrowser from './flows/FlowBrowser'
import registry from './flows/registry'

const nav = [
  { to: '/', label: 'All Flows', end: true },
  ...registry.map(f => ({ to: `/flows/${f.id}`, label: f.title })),
]

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div style={{ padding: 40, color: '#999' }}>Loading...</div>}>
        <Routes>
          <Route element={<SaasLayout nav={nav} />}>
            <Route index element={<FlowBrowser />} />
            {registry.map(flow => (
              <Route key={flow.id} path={`flows/${flow.id}`} element={<flow.component />} />
            ))}
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
