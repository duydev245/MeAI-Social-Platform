import React from 'react'
import { ArrowLeft } from 'lucide-react'
import type { TPublicProfileResponse } from '@/models/feed.model'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

type ProfileHeaderProps = {
  onBack: () => void
}

export type ProfileInfoCardProps = {
  profile: TPublicProfileResponse
  username: string
  displayName: string
  avatarFallback: string
  isOwner: boolean
  isFollowing: boolean
  isFollowPending: boolean
  onEditProfile: () => void
  onChangePassword: () => void
  onToggleFollow: () => void
  onOpenFollowers: () => void
  onOpenFollowing: () => void
}

type ProfileErrorCardProps = {
  onRetry: () => void
  onBack: () => void
}

export const ProfileHeader = React.memo(({ onBack }: ProfileHeaderProps) => (
  <div className='flex items-center gap-2'>
    <Button variant='outline' size='icon-lg' className='rounded-full' aria-label='Go back' onClick={onBack}>
      <ArrowLeft className='h-4 w-4' />
    </Button>
  </div>
))

export const ProfileSkeleton = React.memo(() => (
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

export const ProfileErrorCard = React.memo(({ onRetry, onBack }: ProfileErrorCardProps) => (
  <Card className='border-neutral-200 bg-white'>
    <CardContent className='flex flex-col gap-3 text-sm text-neutral-600'>
      <div>We could not load this profile.</div>
      <div className='flex gap-2'>
        <Button variant='outline' size='sm' onClick={onRetry}>
          Try again
        </Button>
        <Button variant='outline' size='sm' onClick={onBack}>
          Back to home
        </Button>
      </div>
    </CardContent>
  </Card>
))

export const ProfileInfoCard = React.memo(
  ({
    profile,
    username,
    displayName,
    avatarFallback,
    isOwner,
    isFollowing,
    isFollowPending,
    onEditProfile,
    onChangePassword,
    onToggleFollow,
    onOpenFollowers,
    onOpenFollowing
  }: ProfileInfoCardProps) => (
    <Card className='border-neutral-200 bg-white'>
      <CardContent className='grid grid-cols-1 md:grid-cols-3'>
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
            <button type='button' className='space-y-1 cursor-default' onClick={onOpenFollowers}>
              <div className='text-md text-neutral-500'>Followers</div>
              <div className='text-base font-semibold text-neutral-900'>{profile.followersCount}</div>
            </button>
            <button type='button' className='space-y-1 cursor-default' onClick={onOpenFollowing}>
              <div className='text-md text-neutral-500'>Following</div>
              <div className='text-base font-semibold text-neutral-900'>{profile.followingCount}</div>
            </button>
          </div>
          <div className='flex flex-col'>
            <div className='text-4xl font-semibold text-neutral-900'>{displayName}</div>
            <div className='text-base font-light italic text-neutral-900'>@{username}</div>
          </div>
          {isOwner ? (
            <div className='flex items-center justify-between gap-4'>
              <Button variant='outline' className='flex-1' onClick={onEditProfile}>
                Edit profile
              </Button>
              <Button className='flex-1' onClick={onChangePassword}>
                Change password
              </Button>
            </div>
          ) : (
            <Button
              variant={isFollowing ? 'outline' : 'default'}
              onClick={onToggleFollow}
              disabled={isFollowPending}
              className='w-full'
            >
              {isFollowing ? 'Followed' : 'Follow'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
)
