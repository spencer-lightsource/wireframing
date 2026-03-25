/**
 * Flow Registry
 *
 * To add a new vignette:
 *   1. Create a file in src/flows/ (copy an existing flow as a template)
 *   2. Add an entry here
 *   3. It auto-appears in the sidebar and vignette browser
 */

import { lazy } from 'react'

const registry = [
  {
    id: 'sourcing-project',
    title: 'Sourcing Project',
    description: 'Create, configure, and send an RFQ to suppliers — AI-assisted from description to dispatch.',
    tags: ['rfq', 'sourcing', 'ai'],
    component: lazy(() => import('./SourcingProject')),
  },
]

export default registry
