import { hydrateRoot, createRoot } from 'react-dom/client'
import { App } from './App'
import { matchRoute } from './routes'
import './styles/index.css'

const container = document.getElementById('root')!
const route = matchRoute(location.pathname)
const app = <App route={route} />

// Hydrate only when the server rendered this exact route. `vite dev` serves an
// empty shell, and a host may serve some other page for an unknown URL; in both
// cases render from scratch instead of hydrating mismatched markup.
if (container.dataset.path === route.path) {
  hydrateRoot(container, app)
} else {
  container.replaceChildren()
  createRoot(container).render(app)
}
