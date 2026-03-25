/**
 * Flow Registry
 *
 * To add a new vignette:
 *   1. Create a file in src/flows/
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
  {
    id: 'award',
    title: 'Award',
    description: 'Scenario-based award optimization — AI prompts, presets, allocation tables, and supplier comparison.',
    tags: ['award', 'scenarios', 'ai', 'optimization'],
    wide: true,
    component: lazy(() => import('./AwardFlow')),
  },
]

export default registry
