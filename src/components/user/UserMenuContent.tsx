import { LogOut, Monitor, Moon, Sun } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger
} from '@/components/ui/dropdown-menu'
import { authApi } from '@/apis/auth.api'
import type { AppDispatch } from '@/redux/store'
import { removeCurrentUser } from '@/redux/slices/current-user.slice'
import { removeLocalStorage } from '@/utils'

type UserMenuContentProps = {
  side: 'right' | 'bottom'
  displayName: string
  displayEmail: string
  profilePath: string
  avatarUrl?: string
  avatarFallback: string
}

function UserMenuContent({
  side,
  displayName,
  displayEmail,
  profilePath,
  avatarUrl,
  avatarFallback
}: UserMenuContentProps) {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const handleProfileClick = () => {
    navigate(profilePath)
  }

  const handleLogout = async () => {
    try {
      await authApi.signout()
    } finally {
      removeLocalStorage('currentUser')
      dispatch(removeCurrentUser())
      window.location.reload()
    }
  }

  return (
    <DropdownMenuContent side={side} align='end' className='w-64 p-2'>
      <button
        type='button'
        className='flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-neutral-100 cursor-pointer'
        onClick={handleProfileClick}
      >
        <Avatar>
          {avatarUrl ? <AvatarImage src={avatarUrl} alt={displayName} /> : null}
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <div className='flex flex-col text-sm'>
          <span className='font-semibold text-neutral-900'>{displayName}</span>
          <span className='text-xs text-neutral-500'>{displayEmail}</span>
        </div>
      </button>
      <DropdownMenuSeparator className='my-2' />
      <DropdownMenuSub>
        <DropdownMenuSubTrigger className='gap-2 p-2 cursor-pointer'>
          <Sun className='h-4 w-4' />
          Appearance
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent sideOffset={10} alignOffset={-12} className='w-36'>
          <DropdownMenuItem className='gap-2 cursor-pointer'>
            <Sun className='h-4 w-4' />
            Light
          </DropdownMenuItem>
          <DropdownMenuItem className='gap-2 cursor-pointer'>
            <Moon className='h-4 w-4' />
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem className='gap-2 cursor-pointer'>
            <Monitor className='h-4 w-4' />
            System
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
      <DropdownMenuItem variant='destructive' className='gap-2 p-2 cursor-pointer' onClick={handleLogout}>
        <LogOut className='h-4 w-4' />
        Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  )
}

export default UserMenuContent
