import { useMemo, useState } from 'react'
import { Heart, Home, User, Users } from 'lucide-react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/redux/store'
import { PATH } from '@/routes/path'
import CreatePostDialog from '@/components/post/CreatePostDialog'
import SignInRequiredDialog from '@/components/user/SignInRequiredDialog'
import UserMobileHeader from '@/components/user/UserMobileHeader'
import UserMobileNav from '@/components/user/UserMobileNav'
import UserSidebar from '@/components/user/UserSidebar'

function UserLayout({ children }: { children: React.ReactNode }) {
  const [isComposerOpen, setIsComposerOpen] = useState(false)
  const [isSignInOpen, setIsSignInOpen] = useState(false)
  const currentUser = useSelector((state: RootState) => state.currentUser.currentUser)
  const isAuthed = Boolean(currentUser)
  const profilePath = PATH.USER.replace(':username', currentUser?.username ?? 'me')
  const displayName = currentUser?.username ?? 'meai-user'
  const displayEmail = currentUser?.email ?? 'user@meai.social'
  const avatarUrl = currentUser?.avatarPresignedUrl ?? undefined
  const avatarFallback = displayName.slice(0, 2).toUpperCase()

  const navItems = useMemo(
    () => [
      { label: 'For you', to: PATH.HOME, icon: Home, end: true },
      { label: 'Followers', to: PATH.USER_FOLLOWERS, icon: Users, requiresAuth: true },
      { label: 'Activity', to: PATH.USER_ACTIVITY, icon: Heart, requiresAuth: true },
      { label: 'Profile', to: profilePath, icon: User, requiresAuth: true }
    ],
    [profilePath]
  )

  const handleRequireAuth = () => {
    setIsSignInOpen(true)
  }

  const handleCompose = () => {
    if (!isAuthed) {
      setIsSignInOpen(true)
      return
    }
    setIsComposerOpen(true)
  }

  return (
    <>
      <div className='relative min-h-screen bg-white text-neutral-900'>
        <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.08),transparent_55%)]' />
        <div className='pointer-events-none absolute -top-32 right-0 h-72 w-72 rounded-full bg-neutral-900/5 blur-3xl' />

        <UserMobileHeader
          displayName={displayName}
          displayEmail={displayEmail}
          avatarUrl={avatarUrl}
          avatarFallback={avatarFallback}
          isAuthed={isAuthed}
          onRequireAuth={handleRequireAuth}
        />

        <div className='relative mx-auto flex min-h-screen w-full'>
          <UserSidebar
            navItems={navItems}
            isAuthed={isAuthed}
            onCompose={handleCompose}
            onRequireAuth={handleRequireAuth}
            displayName={displayName}
            displayEmail={displayEmail}
            avatarUrl={avatarUrl}
            avatarFallback={avatarFallback}
          />

          <main className='flex flex-1 justify-center'>
            <div className='w-full md:max-w-3xl'>{children}</div>
          </main>
        </div>

        <UserMobileNav
          navItems={navItems}
          isAuthed={isAuthed}
          onCompose={handleCompose}
          onRequireAuth={handleRequireAuth}
        />
      </div>

      <CreatePostDialog open={isComposerOpen} onOpenChange={setIsComposerOpen} />
      <SignInRequiredDialog open={isSignInOpen} onOpenChange={setIsSignInOpen} />
    </>
  )
}

export default UserLayout
