import { Heart, MessageCircle, MoreHorizontal, PencilLine } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

function PostFeed() {
  const mockPost = {
    id: 'post-1',
    username: 'tuannguyen',
    displayName: 'Tuan Nguyen',
    handle: '@tuannguyen',
    avatarUrl: '',
    content: 'Just wrapped up a new UI flow for realtime notifications. The layout feels clean and responsive now.',
    likes: 24,
    comments: 6
  }

  // const { data: userData } = useQuery({
  //   queryKey: ['auth-me'],
  //   queryFn: () => profileApi.getMe(),
  //   retry: false,
  //   refetchOnWindowFocus: false
  //   // cacheTime: 5 * 60 * 1000 // Cache for 5 minutes
  // })
  // console.log('🚀 ~ PostFeed ~ userData:', userData)

  return (
    <div className='flex flex-col gap-4 px-4 py-6 md:px-6'>
      <Card className='border-neutral-200 bg-white'>
        <CardContent className='flex flex-col gap-3'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <Avatar>
                <AvatarImage src='' alt='You' />
                <AvatarFallback>ME</AvatarFallback>
              </Avatar>
              <div className='px-4 py-3 text-sm text-neutral-500'>Hello, what do you want to post today?</div>
            </div>
            <Button variant='outline' size='sm' className='gap-2'>
              <PencilLine className='h-4 w-4' />
              Create post
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className='border-neutral-200 bg-white'>
        <CardContent className='flex flex-col gap-4'>
          <div className='flex items-start justify-between gap-3'>
            <div className='flex items-start gap-3'>
              <Avatar>
                {mockPost.avatarUrl ? <AvatarImage src={mockPost.avatarUrl} alt={mockPost.displayName} /> : null}
                <AvatarFallback>{mockPost.displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className='space-y-1'>
                <div className='flex items-center gap-2 text-sm font-semibold text-neutral-900'>
                  {mockPost.displayName}
                  <span className='text-xs font-normal text-neutral-500'>{mockPost.handle}</span>
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='icon-sm' aria-label='Open post menu'>
                  <MoreHorizontal className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem>Copy link</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className='text-sm text-neutral-800'>{mockPost.content}</div>

          <div className='flex items-center gap-6 text-sm text-neutral-600'>
            <div className='flex items-center gap-2'>
              <Heart className='h-4 w-4' />
              {mockPost.likes}
            </div>
            <div className='flex items-center gap-2'>
              <MessageCircle className='h-4 w-4' />
              {mockPost.comments}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PostFeed
