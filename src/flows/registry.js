/**
 * Flow Registry
 *
 * To add a new flow:
 *   1. Create a file in src/flows/ (copy ExampleFlow.jsx as a template)
 *   2. Add an entry here
 *   3. That's it — it auto-appears in the nav, vignette browser, and gets a shareable URL
 */

import { lazy } from 'react'

const registry = [
  {
    id: 'example',
    title: 'Create Workspace',
    description: 'Multi-step workspace setup wizard with configuration, review, and confirmation.',
    tags: ['onboarding', 'wizard'],
    component: lazy(() => import('./ExampleFlow')),
  },
  // {
  //   id: 'invite-team',
  //   title: 'Invite Team Members',
  //   description: 'Bulk invite flow with role assignment and permission scoping.',
  //   tags: ['team', 'permissions'],
  //   component: lazy(() => import('./InviteTeamFlow')),
  // },
]

export default registry
