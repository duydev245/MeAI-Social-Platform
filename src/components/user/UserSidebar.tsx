import { NavLink } from 'react-router'
import { Menu, Plus, type LucideIcon } from 'lucide-react'
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import UserMenuContent from '@/components/user/UserMenuContent'

type NavItem = {
  label: string
  to: string
  icon: LucideIcon
  end?: boolean
  requiresAuth?: boolean
}

type UserSidebarProps = {
  navItems: NavItem[]
  isAuthed: boolean
  onCompose: () => void
  onRequireAuth: () => void
  onLogoClick: () => void
  displayName: string
  displayEmail: string
  avatarUrl?: string
  avatarFallback: string
}

const itemClass =
  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'

function UserSidebar({
  navItems,
  isAuthed,
  onCompose,
  onRequireAuth,
  onLogoClick,
  displayName,
  displayEmail,
  avatarUrl,
  avatarFallback
}: UserSidebarProps) {
  const primaryItem = navItems[0]
  const secondaryItems = navItems.slice(1)

  return (
    <aside className='hidden md:sticky md:top-0 md:flex md:h-screen md:w-64 md:flex-col md:gap-6 md:self-start md:bg-white md:p-4'>
      <div className='flex items-center justify-between px-4 mb-3 cursor-pointer'>
        <span className='text-3xl font-heading text-black' onClick={onLogoClick}>
          @MeAI
        </span>
      </div>
      <nav className='flex flex-1 flex-col justify-between'>
        <div className='flex flex-col gap-2'>
          {primaryItem
            ? (() => {
                const Icon = primaryItem.icon
                return (
                  <NavLink
                    to={primaryItem.to}
                    end={primaryItem.end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                        isActive
                          ? 'bg-neutral-200 text-neutral-900'
                          : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                      }`
                    }
                  >
                    <Icon className='h-4 w-4' />
                    {primaryItem.label}
                  </NavLink>
                )
              })()
            : null}
          <button
            type='button'
            className='flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100'
            onClick={isAuthed ? onCompose : onRequireAuth}
          >
            <Plus className='h-4 w-4' />
            New post
          </button>
          {secondaryItems.map((item) => {
            const Icon = item.icon
            if (item.requiresAuth && !isAuthed) {
              return (
                <button
                  key={item.label}
                  type='button'
                  className={itemClass}
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
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-neutral-200 text-neutral-900'
                      : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                  }`
                }
              >
                <Icon className='h-4 w-4' />
                {item.label}
              </NavLink>
            )
          })}
        </div>
        {isAuthed ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type='button'
                className='flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100 data-[state=open]:bg-neutral-200'
              >
                <Menu className='h-4 w-4' />
                More
              </button>
            </DropdownMenuTrigger>
            <UserMenuContent
              side='right'
              displayName={displayName}
              displayEmail={displayEmail}
              avatarUrl={avatarUrl}
              avatarFallback={avatarFallback}
            />
          </DropdownMenu>
        ) : (
          <button
            type='button'
            className='flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100'
            onClick={onRequireAuth}
          >
            <Menu className='h-4 w-4' />
            More
          </button>
        )}
      </nav>
    </aside>
  )
}

export default UserSidebar
