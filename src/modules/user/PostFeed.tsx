import { Heart, MessageCircle, MoreHorizontal, PencilLine } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import type { RootState } from '@/redux/store'
import type { TPostResponse } from '@/models/feed.model'
import { PATH } from '@/routes/path'
import { useFeedInfiniteQuery, useToggleLike } from '@/hooks/use-feed'
import { formatRelativeTime } from '@/utils'
import CreatePostDialog from '@/components/post/CreatePostDialog'
import SignInRequiredDialog from '@/components/user/SignInRequiredDialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'

const FEED_LIMIT = 10

const PostFeedSkeleton = React.memo(() => (
  <div className='flex flex-col gap-4'>
    {Array.from({ length: 2 }).map((_, index) => (
      <Card key={`post-skeleton-${index}`} className='border-neutral-200 bg-white'>
        <CardContent className='flex flex-col gap-4'>
          <div className='flex items-start gap-3'>
            <Skeleton className='h-10 w-10 rounded-full' />
            <div className='flex-1 space-y-2'>
              <Skeleton className='h-3 w-36' />
              <Skeleton className='h-3 w-24' />
            </div>
          </div>
          <Skeleton className='h-16 w-full' />
          <div className='flex gap-6'>
            <Skeleton className='h-3 w-12' />
            <Skeleton className='h-3 w-12' />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
))

const NoPosts = React.memo(() => (
  <Card className='border-neutral-200 bg-white'>
    <CardContent className='text-sm text-neutral-600'>No posts yet. Follow someone or create a post.</CardContent>
  </Card>
))

function PostFeed() {
  const navigate = useNavigate()
  const currentUser = useSelector((state: RootState) => state.currentUser.currentUser)
  const isAuthed = Boolean(currentUser)
  const profilePath = PATH.USER_PROFILE.replace(':username', `@${currentUser?.username ?? 'me'}`)
  const displayName = currentUser?.username ?? 'meai-user'
  const avatarFallback = displayName.slice(0, 2).toUpperCase()
  const [isComposerOpen, setIsComposerOpen] = useState(false)
  const [isSignInOpen, setIsSignInOpen] = useState(false)
  const feedQuery = useFeedInfiniteQuery({ enabled: true, limit: FEED_LIMIT })
  const toggleLike = useToggleLike(FEED_LIMIT)
  const posts = useMemo(() => feedQuery.data?.pages.flat() ?? [], [feedQuery.data])

  const handleCompose = () => {
    if (!isAuthed) {
      setIsSignInOpen(true)
      return
    }
    setIsComposerOpen(true)
  }

  const handleOpenDetail = (post: TPostResponse) => {
    navigate(PATH.POST_DETAIL.replace(':username', post.userId).replace(':postId', post.id))
  }

  const handleToggleLike = (post: TPostResponse) => {
    if (!isAuthed) {
      setIsSignInOpen(true)
      return
    }
    toggleLike.mutate({ postId: post.id, isLiked: Boolean(post.isLikedByCurrentUser) })
  }

  return (
    <>
      <div className='flex flex-col gap-4 px-4 py-6 md:px-6'>
        {isAuthed ? (
          <Card className='border-neutral-200 bg-white'>
            <CardContent className='flex flex-col gap-3'>
              <div className='flex flex-wrap items-center gap-4'>
                <div className='flex-1 flex items-center gap-3'>
                  <Avatar className='cursor-pointer' onClick={() => navigate(profilePath)}>
                    <AvatarFallback>{avatarFallback}</AvatarFallback>
                  </Avatar>
                  <div className='flex-1 text-sm text-neutral-500 cursor-text' onClick={handleCompose}>
                    Hello {displayName}, any thoughts today?
                  </div>
                </div>
                <Button variant='outline' size='sm' className='gap-2' onClick={handleCompose}>
                  <PencilLine className='h-4 w-4' />
                  Create post
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {feedQuery.isLoading ? (
          <PostFeedSkeleton />
        ) : feedQuery.isError ? (
          <Card className='border-neutral-200 bg-white'>
            <CardContent className='flex flex-col gap-3 text-sm text-neutral-600'>
              <div>Something went wrong while loading your feed.</div>
              <Button variant='outline' size='sm' onClick={() => feedQuery.refetch()}>
                Try again
              </Button>
            </CardContent>
          </Card>
        ) : posts.length === 0 ? (
          <NoPosts />
        ) : (
          <div className='flex flex-col gap-4'>
            {posts.map((post) => {
              const isLiked = Boolean(post.isLikedByCurrentUser)
              const heartClass = isLiked ? 'h-4 w-4 text-rose-500 fill-rose-500' : 'h-4 w-4'
              const timeLabel = formatRelativeTime(post.createdAt)

              return (
                <Card
                  key={post.id}
                  className='cursor-pointer border-neutral-200 bg-white transition hover:shadow-sm'
                  onClick={() => handleOpenDetail(post)}
                >
                  <CardContent className='flex flex-col gap-4'>
                    <div className='flex items-start justify-between gap-3'>
                      <div className='flex items-start gap-3' onClick={(event) => event.stopPropagation()}>
                        <Avatar>
                          <AvatarFallback>Me</AvatarFallback>
                        </Avatar>
                        <div className='space-y-1'>
                          <div className='flex items-center gap-2 text-sm font-semibold text-neutral-900'>
                            <span className='break-all'>{post.userId}</span>
                            {timeLabel ? (
                              <span className='text-xs font-normal text-neutral-500'>{timeLabel}</span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon-sm'
                            aria-label='Open post menu'
                            onClick={(event) => event.stopPropagation()}
                          >
                            <MoreHorizontal className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem>Copy link</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {post.content ? (
                      <div className='text-sm text-neutral-800 whitespace-pre-wrap'>{post.content}</div>
                    ) : null}

                    <div className='flex items-center gap-6 text-sm text-neutral-600'>
                      <button
                        type='button'
                        className='flex items-center gap-2 transition hover:text-neutral-900'
                        onClick={(event) => {
                          event.stopPropagation()
                          handleToggleLike(post)
                        }}
                      >
                        <Heart className={heartClass} />
                        {post.likesCount}
                      </button>
                      <button
                        type='button'
                        className='flex items-center gap-2 transition hover:text-neutral-900'
                        onClick={(event) => {
                          event.stopPropagation()
                          handleOpenDetail(post)
                        }}
                      >
                        <MessageCircle className='h-4 w-4' />
                        {post.commentsCount}
                      </button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {isAuthed && feedQuery.hasNextPage ? (
          <div className='flex justify-center'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => feedQuery.fetchNextPage()}
              disabled={feedQuery.isFetchingNextPage}
            >
              {feedQuery.isFetchingNextPage ? 'Loading...' : 'Load more'}
            </Button>
          </div>
        ) : null}
      </div>

      <CreatePostDialog open={isComposerOpen} onOpenChange={setIsComposerOpen} />
      <SignInRequiredDialog open={isSignInOpen} onOpenChange={setIsSignInOpen} />
    </>
  )
}

export default PostFeed
