import { NavLink } from 'react-router'
import { Plus, type LucideIcon } from 'lucide-react'

type NavItem = {
  label: string
  to: string
  icon: LucideIcon
  end?: boolean
  requiresAuth?: boolean
}

type UserMobileNavProps = {
  navItems: NavItem[]
  isAuthed: boolean
  onCompose: () => void
  onRequireAuth: () => void
}

function UserMobileNav({ navItems, isAuthed, onCompose, onRequireAuth }: UserMobileNavProps) {
  const primaryItems = navItems.slice(0, 2)
  const secondaryItems = navItems.slice(2)

  const renderItem = (item: NavItem) => {
    const Icon = item.icon
    if (item.requiresAuth && !isAuthed) {
      return (
        <button
          key={item.label}
          type='button'
          className='flex flex-col items-center gap-1 px-2 text-neutral-500'
          onClick={onRequireAuth}
          aria-disabled='true'
        >
          <Icon className='h-4 w-4' />
          {item.label}
        </button>
      )
    }

    return (
      <NavLink
        key={item.label}
        to={item.to}
        end={item.end}
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 px-2 ${isActive ? 'text-neutral-900' : 'text-neutral-500'}`
        }
      >
        <Icon className='h-4 w-4' />
        {item.label}
      </NavLink>
    )
  }

  return (
    <nav className='fixed bottom-4 left-1/2 z-40 flex w-[min(100%-2rem,28rem)] -translate-x-1/2 items-center justify-between rounded-2xl border border-neutral-200 bg-white/95 px-4 py-2 text-[11px] font-medium text-neutral-500 shadow-[0_18px_40px_rgba(15,23,42,0.14)] backdrop-blur md:hidden'>
      {primaryItems.map(renderItem)}
      <button
        type='button'
        className='flex h-12 w-12 items-center justify-center rounded-md bg-neutral-100 text-white'
        aria-label='Create new post'
        onClick={onCompose}
      >
        <Plus className='h-5 w-5 text-neutral-500' />
      </button>
      {secondaryItems.map(renderItem)}
    </nav>
  )
}

export default UserMobileNav
