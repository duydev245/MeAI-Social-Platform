import { useMemo, useState } from 'react'
import { NavLink } from 'react-router'
import { Heart, Home, LogOut, Menu, Monitor, Moon, Plus, Sun, User, Users } from 'lucide-react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/redux/store'
import { PATH } from '@/routes/path'
import CreatePostDialog from '@/components/post/CreatePostDialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

function UserLayout({ children }: { children: React.ReactNode }) {
  const [isComposerOpen, setIsComposerOpen] = useState(false)
  const currentUser = useSelector((state: RootState) => state.currentUser.currentUser)
  const profilePath = PATH.USER.replace(':username', currentUser?.username ?? 'me')
  const displayName = currentUser?.username ?? 'meai-user'
  const displayEmail = currentUser?.email ?? 'user@meai.social'
  const avatarUrl = currentUser?.avatarPresignedUrl ?? undefined
  const avatarFallback = displayName.slice(0, 2).toUpperCase()

  const navItems = useMemo(
    () => [
      { label: 'For you', to: PATH.HOME, icon: Home, end: true },
      { label: 'Followers', to: PATH.USER_FOLLOWERS, icon: Users },
      { label: 'Activity', to: PATH.USER_ACTIVITY, icon: Heart },
      { label: 'Profile', to: profilePath, icon: User }
    ],
    [profilePath]
  )

  const userMenuContent = (side: 'right' | 'bottom') => (
    <DropdownMenuContent side={side} align='end' className='w-64 p-2'>
      <div className='flex items-center gap-3 rounded-lg px-2 py-2 cursor-pointer'>
        <Avatar>
          {avatarUrl ? <AvatarImage src={avatarUrl} alt={displayName} /> : null}
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <div className='flex flex-col text-sm'>
          <span className='font-semibold text-neutral-900'>{displayName}</span>
          <span className='text-xs text-neutral-500'>{displayEmail}</span>
        </div>
      </div>
      <DropdownMenuSeparator className='my-2' />
      <DropdownMenuSub>
        <DropdownMenuSubTrigger className='gap-2 p-2'>
          <Sun className='h-4 w-4' />
          Appearance
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent sideOffset={10} className='w-36'>
          <DropdownMenuItem className='gap-2'>
            <Sun className='h-4 w-4' />
            Light
          </DropdownMenuItem>
          <DropdownMenuItem className='gap-2'>
            <Moon className='h-4 w-4' />
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem className='gap-2'>
            <Monitor className='h-4 w-4' />
            System
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>

      <DropdownMenuItem variant='destructive' className='gap-2 p-2'>
        <LogOut className='h-4 w-4' />
        Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  )

  return (
    <>
      <div className='relative min-h-screen bg-white text-neutral-900'>
        <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.08),transparent_55%)]' />
        <div className='pointer-events-none absolute -top-32 right-0 h-72 w-72 rounded-full bg-neutral-900/5 blur-3xl' />

        <header className='sticky top-0 z-30 flex items-center justify-between border-b border-neutral-200/60 bg-white/95 px-4 py-3 backdrop-blur md:hidden'>
          <span className='text-2xl font-heading text-black'>@MeAI</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type='button'
                className='flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 text-neutral-700 transition hover:bg-neutral-100'
                aria-label='Open menu'
              >
                <Menu className='h-4 w-4' />
              </button>
            </DropdownMenuTrigger>
            {userMenuContent('bottom')}
          </DropdownMenu>
        </header>

        <div className='relative mx-auto flex min-h-screen w-full'>
          <aside className='hidden md:sticky md:top-0 md:flex md:h-screen md:w-64 md:flex-col md:gap-6 md:self-start md:bg-white md:p-4'>
            <div className='flex items-center justify-between px-4 mb-3 cursor-pointer'>
              <span className='text-3xl font-heading text-black'>@MeAI</span>
            </div>
            <nav className='flex flex-1 flex-col justify-between'>
              <div className='flex flex-col gap-2'>
                <NavLink
                  to={PATH.HOME}
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                      isActive
                        ? 'bg-neutral-200 text-neutral-900'
                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                    }`
                  }
                >
                  <Home className='h-4 w-4' />
                  For you
                </NavLink>
                <button
                  type='button'
                  className='flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100'
                  onClick={() => setIsComposerOpen(true)}
                >
                  <Plus className='h-4 w-4' />
                  New post
                </button>
                {navItems.slice(1).map((item) => {
                  const Icon = item.icon
                  return (
                    <NavLink
                      key={item.label}
                      to={item.to}
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
                {userMenuContent('right')}
              </DropdownMenu>
            </nav>
          </aside>

          <main className='flex flex-1 justify-center'>
            <div className='w-full md:max-w-3xl'>{children}</div>
          </main>
        </div>

        <nav className='fixed bottom-4 left-1/2 z-40 flex w-[min(100%-2rem,28rem)] -translate-x-1/2 items-center justify-between rounded-2xl border border-neutral-200 bg-white/95 px-4 py-2 text-[11px] font-medium text-neutral-500 shadow-[0_18px_40px_rgba(15,23,42,0.14)] backdrop-blur md:hidden'>
          <NavLink
            to={PATH.HOME}
            end
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-2 ${isActive ? 'text-neutral-900' : 'text-neutral-500'}`
            }
          >
            <Home className='h-4 w-4' />
            For you
          </NavLink>

          <NavLink
            to={PATH.USER_FOLLOWERS}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-2 ${isActive ? 'text-neutral-900' : 'text-neutral-500'}`
            }
          >
            <Users className='h-4 w-4' />
            Followers
          </NavLink>

          <button
            type='button'
            className='flex h-12 w-12 items-center justify-center rounded-md bg-neutral-100 text-white'
            aria-label='Create new post'
            onClick={() => setIsComposerOpen(true)}
          >
            <Plus className='h-5 w-5 text-neutral-500' />
          </button>

          <NavLink
            to={PATH.USER_ACTIVITY}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-2 ${isActive ? 'text-neutral-900' : 'text-neutral-500'}`
            }
          >
            <Heart className='h-4 w-4' />
            Activity
          </NavLink>

          <NavLink
            to={profilePath}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-2 ${isActive ? 'text-neutral-900' : 'text-neutral-500'}`
            }
          >
            <User className='h-4 w-4' />
            Profile
          </NavLink>
        </nav>
      </div>

      <CreatePostDialog open={isComposerOpen} onOpenChange={setIsComposerOpen} />
    </>
  )
}

export default UserLayout
