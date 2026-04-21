import { ArrowLeft, PencilLine } from 'lucide-react'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'
import type { RootState, AppDispatch } from '@/redux/store'
import type { TPostResponse, TPublicProfileResponse } from '@/models/feed.model'
import { feedApi } from '@/apis/feed.api'
import { feedKeys, useProfilePostsInfiniteQuery, useProfileQuery, useToggleLikeInQuery } from '@/hooks/use-feed'
import { PATH } from '@/routes/path'
import { profileApi } from '@/apis/profile.api'
import { handleAuthSuccess } from '@/modules/auth/helpers/auth.helpers'
import CreatePostDialog from '@/components/post/CreatePostDialog'
import DeletePostDialog from '@/components/post/DeletePostDialog'
import EditPostDialog from '@/components/post/EditPostDialog'
import PostCard from '@/components/post/PostCard'
import PostFeedSkeleton from '@/components/post/PostFeedSkeleton'
import PostMediaViewerDialog from '@/components/post/PostMediaViewerDialog'
import ReportPostDialog from '@/components/post/ReportPostDialog'
import SignInRequiredDialog from '@/components/user/SignInRequiredDialog'
import EditProfileDialog from '@/components/user/EditProfileDialog'
import ChangePasswordDialog from '@/components/user/ChangePasswordDialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { PostMediaItem } from '@/components/post/PostMediaScroller'

const PROFILE_POST_LIMIT = 10

type MediaViewerState = {
  open: boolean
  items: PostMediaItem[]
  index: number
  fallbackType: string | null
}

const ProfileSkeleton = React.memo(() => (
  <Card className='border-neutral-200 bg-white'>
    <CardContent className='flex flex-col items-center gap-4'>
      <Skeleton className='h-20 w-20 rounded-full' />
      <div className='grid w-full max-w-sm grid-cols-3 gap-6'>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={`stat-${index}`} className='space-y-2 text-center'>
            <Skeleton className='mx-auto h-4 w-10' />
            <Skeleton className='mx-auto h-3 w-12' />
          </div>
        ))}
      </div>
      <Skeleton className='h-4 w-32' />
      <Skeleton className='h-9 w-40' />
    </CardContent>
  </Card>
))

function UserProfile() {
  const navigate = useNavigate()
  const { username: usernameParam } = useParams()
  const currentUser = useSelector((state: RootState) => state.currentUser.currentUser)
  const dispatch = useDispatch<AppDispatch>()
  const queryClient = useQueryClient()

  if (!usernameParam || !usernameParam.startsWith('@')) {
    return <Navigate to={PATH.HOME} replace />
  }

  const username = usernameParam.replace(/^@/, '')
  const isAuthed = Boolean(currentUser)
  const isOwner = Boolean(currentUser?.username && currentUser.username.toLowerCase() === username.toLowerCase())

  const profileQuery = useProfileQuery(username, true)
  const profilePostsQuery = useProfilePostsInfiniteQuery(username, {
    enabled: Boolean(username),
    limit: PROFILE_POST_LIMIT
  })
  const posts = useMemo(() => profilePostsQuery.data?.pages.flat() ?? [], [profilePostsQuery.data])

  const profileKey = useMemo(() => feedKeys.profile(username), [username])
  const postsKey = useMemo(() => feedKeys.profilePosts(username, PROFILE_POST_LIMIT), [username])
  const toggleLike = useToggleLikeInQuery(postsKey)

  const [isComposerOpen, setIsComposerOpen] = useState(false)
  const [isSignInOpen, setIsSignInOpen] = useState(false)
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<TPostResponse | null>(null)
  const [reportingPost, setReportingPost] = useState<TPostResponse | null>(null)
  const [deletingPost, setDeletingPost] = useState<TPostResponse | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const [mediaViewer, setMediaViewer] = useState<MediaViewerState>({
    open: false,
    items: [],
    index: 0,
    fallbackType: null
  })

  const profile = profileQuery.data
  const meQuery = useQuery({
    queryKey: ['profile', 'me'],
    enabled: isEditProfileOpen && !currentUser,
    queryFn: profileApi.getMe
  })

  const editableProfile = currentUser ?? meQuery.data?.value ?? null

  const updateProfileMutation = useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: async () => {
      await handleAuthSuccess(dispatch)
      queryClient.invalidateQueries({ queryKey: feedKeys.profile(username) })
      queryClient.invalidateQueries({ queryKey: feedKeys.profilePosts(username, PROFILE_POST_LIMIT) })
      toast.success('Profile updated')
      setIsEditProfileOpen(false)
    },
    onError: () => {
      toast.error('Could not update profile')
    }
  })

  const uploadAvatarMutation = useMutation({
    mutationFn: profileApi.uploadAvatar,
    onSuccess: async () => {
      await handleAuthSuccess(dispatch)
      queryClient.invalidateQueries({ queryKey: feedKeys.profile(username) })
      queryClient.invalidateQueries({ queryKey: feedKeys.profilePosts(username, PROFILE_POST_LIMIT) })
      toast.success('Avatar updated')
      setIsEditProfileOpen(false)
    },
    onError: () => {
      toast.error('Could not upload avatar')
    }
  })

  const displayName = profile?.fullName ?? 'Unnamed'
  const avatarFallback = profile?.username ? profile.username.slice(0, 2).toUpperCase() : 'ME'
  const isFollowing = Boolean(profile?.isFollowedByCurrentUser)

  const followMutation = useMutation({
    mutationFn: ({ userId, isFollowed }: { userId: string; isFollowed: boolean }) =>
      isFollowed ? feedApi.unfollowUser(userId) : feedApi.followUser(userId),
    onMutate: async ({ isFollowed }) => {
      await queryClient.cancelQueries({ queryKey: profileKey })
      const previous = queryClient.getQueryData<TPublicProfileResponse>(profileKey)

      queryClient.setQueryData<TPublicProfileResponse>(profileKey, (current) => {
        if (!current) return current
        const nextFollowed = !isFollowed
        const delta = nextFollowed ? 1 : -1
        return {
          ...current,
          isFollowedByCurrentUser: nextFollowed,
          followersCount: Math.max(0, current.followersCount + delta)
        }
      })

      return { previous }
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(profileKey, context.previous)
      }
      toast.error('Could not update follow status')
    },
    onSuccess: (_data, variables) => {
      queryClient.setQueryData<TPublicProfileResponse>(profileKey, (current) => {
        if (!current) return current
        return {
          ...current,
          isFollowedByCurrentUser: !variables.isFollowed
        }
      })
    }
  })

  const handleCompose = useCallback(() => {
    if (!isAuthed) {
      setIsSignInOpen(true)
      return
    }
    setIsComposerOpen(true)
  }, [isAuthed])

  const handleOpenDetail = useCallback(
    (post: TPostResponse) => {
      navigate(PATH.POST_DETAIL.replace(':username', `@${post.username}`).replace(':postId', post.id))
    },
    [navigate]
  )

  const handleToggleLike = useCallback(
    (post: TPostResponse) => {
      if (!isAuthed) {
        setIsSignInOpen(true)
        return
      }
      toggleLike.mutate({ postId: post.id, isLiked: Boolean(post.isLikedByCurrentUser) })
    },
    [isAuthed, toggleLike]
  )

  const handleOpenMedia = useCallback((items: PostMediaItem[], index: number, fallbackType: string | null) => {
    setMediaViewer({ open: true, items, index, fallbackType })
  }, [])

  const handleCloseMedia = useCallback(() => {
    setMediaViewer((current) => ({ ...current, open: false }))
  }, [])

  const handlePrevMedia = useCallback(() => {
    setMediaViewer((current) => ({ ...current, index: Math.max(0, current.index - 1) }))
  }, [])

  const handleNextMedia = useCallback(() => {
    setMediaViewer((current) => ({
      ...current,
      index: Math.min(current.items.length - 1, current.index + 1)
    }))
  }, [])

  const handleEditPost = useCallback(
    (post: TPostResponse) => {
      if (!isAuthed) {
        setIsSignInOpen(true)
        return
      }
      setEditingPost(post)
    },
    [isAuthed]
  )

  const handleReportPost = useCallback(
    (post: TPostResponse) => {
      if (!isAuthed) {
        setIsSignInOpen(true)
        return
      }
      setReportingPost(post)
    },
    [isAuthed]
  )

  const handleDeletePost = useCallback(
    (post: TPostResponse) => {
      if (!isAuthed) {
        setIsSignInOpen(true)
        return
      }
      setDeletingPost(post)
    },
    [isAuthed]
  )

  const handleUserClick = useCallback(
    (nextUsername: string) => {
      const userPath = PATH.USER_PROFILE.replace(':username', `@${nextUsername}`)
      navigate(userPath)
    },
    [navigate]
  )

  const handleToggleFollow = useCallback(() => {
    if (!profile) return
    if (!isAuthed) {
      setIsSignInOpen(true)
      return
    }
    followMutation.mutate({ userId: profile.userId, isFollowed: Boolean(profile.isFollowedByCurrentUser) })
  }, [followMutation, isAuthed, profile])

  useEffect(() => {
    if (!profilePostsQuery.hasNextPage) return
    const target = loadMoreRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry?.isIntersecting) return
        if (profilePostsQuery.isFetchingNextPage) return
        profilePostsQuery.fetchNextPage()
      },
      { rootMargin: '240px' }
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [profilePostsQuery.fetchNextPage, profilePostsQuery.hasNextPage, profilePostsQuery.isFetchingNextPage])

  const ProfileError = useCallback(
    () => (
      <Card className='border-neutral-200 bg-white'>
        <CardContent className='flex flex-col gap-3 text-sm text-neutral-600'>
          <div>We could not load this profile.</div>
          <div className='flex gap-2'>
            <Button variant='outline' size='sm' onClick={() => profileQuery.refetch()}>
              Try again
            </Button>
            <Button variant='outline' size='sm' onClick={() => navigate(PATH.HOME)}>
              Back to home
            </Button>
          </div>
        </CardContent>
      </Card>
    ),
    [navigate, profileQuery]
  )

  return (
    <>
      <div className='flex flex-col gap-4 px-4 py-6 md:px-6'>
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='icon-lg'
            className='rounded-full'
            aria-label='Go back'
            onClick={() => navigate(PATH.HOME)}
          >
            <ArrowLeft className='h-4 w-4' />
          </Button>
        </div>

        {profileQuery.isLoading ? (
          <ProfileSkeleton />
        ) : profileQuery.isError || !profile ? (
          <ProfileError />
        ) : (
          <Card className='border-neutral-200 bg-white'>
            <CardContent className='grid grid-cols-1 md:grid-cols-3 '>
              <Avatar className='col-span-1 h-40 w-40 mx-auto'>
                {profile.avatarUrl ? <AvatarImage src={profile.avatarUrl} alt={profile.username} /> : null}
                <AvatarFallback>{avatarFallback}</AvatarFallback>
              </Avatar>
              <div className='col-span-2 space-y-4'>
                <div className='grid w-full grid-cols-3 gap-6 text-center'>
                  <div className='space-y-1 cursor-default'>
                    <div className='text-md text-neutral-500'>Posts</div>
                    <div className='text-base font-semibold text-neutral-900'>{profile.postCount}</div>
                  </div>
                  <div
                    className='space-y-1 cursor-default'
                    onClick={() => {
                      if (isOwner) navigate(PATH.USER_FOLLOWERS)
                      return
                    }}
                  >
                    <div className='text-md text-neutral-500'>Followers</div>
                    <div className='text-base font-semibold text-neutral-900'>{profile.followersCount}</div>
                  </div>
                  <div
                    className='space-y-1 cursor-default'
                    onClick={() => {
                      if (isOwner) navigate(PATH.USER_FOLLOWERS)
                      return
                    }}
                  >
                    <div className='text-md text-neutral-500'>Following</div>
                    <div className='text-base font-semibold text-neutral-900'>{profile.followingCount}</div>
                  </div>
                </div>
                <div className='flex flex-col'>
                  <div className='text-4xl font-semibold text-neutral-900'>{displayName}</div>
                  <div className='text-base font-light italic text-neutral-900'>@{username}</div>
                </div>
                {isOwner ? (
                  <div className='flex items-center justify-between gap-4'>
                    <Button variant='outline' className='flex-1' onClick={() => setIsEditProfileOpen(true)}>
                      Edit profile
                    </Button>
                    <Button className='flex-1' onClick={() => setIsChangePasswordOpen(true)}>
                      Change password
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant={isFollowing ? 'outline' : 'default'}
                    onClick={handleToggleFollow}
                    disabled={followMutation.isPending}
                    className='w-full'
                  >
                    {isFollowing ? 'Followed' : 'Follow'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className='flex flex-col gap-4'>
          {isOwner ? (
            <Card className='border-neutral-200 bg-white'>
              <CardContent className='flex flex-col gap-3'>
                <div className='flex flex-wrap items-center gap-4'>
                  <div className='flex-1 flex items-center gap-3'>
                    <Avatar className='cursor-pointer'>
                      {currentUser?.avatarPresignedUrl ? (
                        <AvatarImage src={currentUser.avatarPresignedUrl} alt={currentUser.username} />
                      ) : null}
                      <AvatarFallback>{currentUser?.username?.slice(0, 2).toUpperCase() ?? 'ME'}</AvatarFallback>
                    </Avatar>
                    <div className='flex-1 text-sm text-neutral-500 cursor-text' onClick={handleCompose}>
                      Hello {currentUser?.username ?? 'meai-user'}, any thoughts today?
                    </div>
                  </div>
                  <Button variant='outline' size='lg' className='gap-2 w-full sm:w-auto' onClick={handleCompose}>
                    <PencilLine className='h-4 w-4' />
                    Write something
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : null}

          {profilePostsQuery.isLoading ? (
            <PostFeedSkeleton />
          ) : profilePostsQuery.isError ? (
            <Card className='border-neutral-200 bg-white'>
              <CardContent className='flex flex-col gap-3 text-sm text-neutral-600'>
                <div>Something went wrong while loading posts.</div>
                <Button variant='outline' size='sm' onClick={() => profilePostsQuery.refetch()}>
                  Try again
                </Button>
              </CardContent>
            </Card>
          ) : posts.length === 0 ? (
            <Card className='border-neutral-200 bg-white'>
              <CardContent className='text-sm text-neutral-600'>No posts yet.</CardContent>
            </Card>
          ) : (
            <div className='flex flex-col gap-4'>
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  isAuthed={isAuthed}
                  onOpenDetail={handleOpenDetail}
                  onToggleLike={handleToggleLike}
                  onOpenMedia={handleOpenMedia}
                  onEditPost={handleEditPost}
                  onReportPost={handleReportPost}
                  onDeletePost={handleDeletePost}
                  onUserClick={handleUserClick}
                />
              ))}
            </div>
          )}

          {profilePostsQuery.hasNextPage ? <div ref={loadMoreRef} className='h-1 w-full' /> : null}
        </div>
      </div>

      <CreatePostDialog open={isComposerOpen} onOpenChange={setIsComposerOpen} />
      <EditPostDialog
        open={Boolean(editingPost)}
        post={editingPost}
        onOpenChange={(open) => setEditingPost((current) => (open ? current : null))}
      />
      <ReportPostDialog
        open={Boolean(reportingPost)}
        post={reportingPost}
        onOpenChange={(open) => setReportingPost((current) => (open ? current : null))}
      />
      <DeletePostDialog
        open={Boolean(deletingPost)}
        post={deletingPost}
        onOpenChange={(open) => setDeletingPost((current) => (open ? current : null))}
      />
      <SignInRequiredDialog open={isSignInOpen} onOpenChange={setIsSignInOpen} />
      <PostMediaViewerDialog
        open={mediaViewer.open}
        items={mediaViewer.items}
        index={mediaViewer.index}
        fallbackType={mediaViewer.fallbackType}
        onOpenChange={handleCloseMedia}
        onPrev={handlePrevMedia}
        onNext={handleNextMedia}
      />
      <EditProfileDialog
        open={isEditProfileOpen}
        onOpenChange={setIsEditProfileOpen}
        profile={editableProfile}
        isProfileLoading={isEditProfileOpen && !currentUser && meQuery.isLoading}
        isProfileError={isEditProfileOpen && !currentUser && meQuery.isError}
        onRetry={meQuery.refetch}
        onSubmit={(payload) => updateProfileMutation.mutate(payload)}
        onUploadAvatar={(file) => uploadAvatarMutation.mutate(file)}
        isSaving={updateProfileMutation.isPending}
        isUploading={uploadAvatarMutation.isPending}
      />
      <ChangePasswordDialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen} />
    </>
  )
}

export default UserProfile
