import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

import { getContext } from './integrations/tanstack-query/root-provider'
import { useAuthStore } from './stores/auth.store'

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    context: {
      ...getContext(),
      auth: {
        isAuthenticated: useAuthStore.getState().isAuthenticated(),
        user: useAuthStore.getState().user
      }
    },
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
  })

  // Subscribe to auth store changes to invalidate router cache/context when auth changes
  useAuthStore.subscribe((state) => {
    router.invalidate()
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
