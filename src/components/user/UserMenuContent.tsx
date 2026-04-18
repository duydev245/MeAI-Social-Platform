import { LogOut, Monitor, Moon, Sun } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger
} from '@/components/ui/dropdown-menu'

type UserMenuContentProps = {
  side: 'right' | 'bottom'
  displayName: string
  displayEmail: string
  avatarUrl?: string
  avatarFallback: string
}

function UserMenuContent({ side, displayName, displayEmail, avatarUrl, avatarFallback }: UserMenuContentProps) {
  return (
    <DropdownMenuContent side={side} align='end' className='w-64 p-2'>
      <div className='flex items-center gap-3 rounded-lg px-2 py-2'>
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
        <DropdownMenuSubContent sideOffset={10} alignOffset={-12} className='w-36'>
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
}

export default UserMenuContent
