import { StrictMode } from 'react'
import type { Route } from './routes'
import { Chrome } from './components/Chrome'

export function App({ route }: { route: Route }) {
  return (
    <StrictMode>
      <Chrome>{route.element()}</Chrome>
    </StrictMode>
  )
}
