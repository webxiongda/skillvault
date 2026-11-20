import { Icon } from '../icons'
import { ROUTES, type RoutePath } from '../routes'

interface Props {
  current: RoutePath
}

export function NavBar({ current }: Props) {
  const index = ROUTES.findIndex((route) => route.path === current) + 1

  return (
    <div className="nav-bar glass">
      <nav className="nav-track" aria-label="主导航">
        {ROUTES.map((route) => (
          <a
            key={route.path}
            href={`#/${route.path}`}
            className={`nav-link ${current === route.path ? 'active' : ''}`}
            aria-current={current === route.path ? 'page' : undefined}
          >
            <Icon name={route.icon} size={15} />
            <span>{route.label}</span>
          </a>
        ))}
      </nav>
      <span className="nav-index">{String(index).padStart(2, '0')} / {ROUTES.length}</span>
    </div>
  )
}
