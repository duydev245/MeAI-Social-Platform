import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useNotifications } from '@/hooks/use-notifications'
import { parseNotificationPayload, type NotificationDeliveryModel } from '@/models/notification.model'
import { formatDate } from '@/utils'
import { useCallback } from 'react'

function UserActivity() {
  const { items, isLoading, isConnected, unreadCount, markAsRead, markAllAsRead } = useNotifications()

  const _renderItem = useCallback(
    (item: NotificationDeliveryModel, index: number) => {
      const payload = parseNotificationPayload(item.payloadJson)
      const hasPayload = payload && typeof payload === 'object'

      return (
        <Card key={item.userNotificationId || index} className={item.isRead ? 'bg-white' : 'bg-neutral-50'}>
          <CardHeader className='flex flex-row items-start justify-between gap-3'>
            <div className='space-y-1'>
              <CardTitle className='text-sm text-neutral-900'>{item.title || 'Notification'}</CardTitle>
              <p className='text-xs text-neutral-500'>
                {formatDate(item.createdAt)} · {item.source}
              </p>
            </div>
            <div className='flex items-center gap-2'>
              {!item.isRead ? <span className='h-2 w-2 rounded-full bg-red-500' aria-hidden='true' /> : null}
              {!item.isRead ? (
                <Button
                  variant='ghost'
                  size='sm'
                  className='text-neutral-600 hover:text-neutral-900'
                  onClick={() => markAsRead(item.userNotificationId)}
                >
                  Mark as read
                </Button>
              ) : null}
            </div>
          </CardHeader>
          <CardContent className='space-y-2 text-sm text-neutral-700'>
            <p>{item.message}</p>
            {hasPayload ? (
              <pre className='overflow-x-auto rounded-lg bg-neutral-100 p-3 text-xs text-neutral-700'>
                {JSON.stringify(payload, null, 2)}
              </pre>
            ) : null}
          </CardContent>
        </Card>
      )
    },
    [items, markAsRead]
  )

  const _renderSkeleton = useCallback(() => {
    return (
      <div className='flex flex-col gap-3'>
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={`skeleton-${index}`} className='bg-white'>
            <CardHeader className='flex flex-row items-start justify-between gap-3'>
              <div className='space-y-2'>
                <Skeleton className='h-4 w-40' />
                <Skeleton className='h-3 w-28' />
              </div>
              <Skeleton className='h-7 w-24 rounded-lg' />
            </CardHeader>
            <CardContent className='space-y-2'>
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-5/6' />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }, [])

  return (
    <div className='flex flex-col gap-4 px-4 py-6 md:px-6'>
      <div className='flex items-center justify-between md:p-4'>
        <div className='flex items-start gap-1'>
          <h1 className='text-2xl font-semibold text-neutral-900'>Activity</h1>
          <div aria-hidden='true' className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        </div>
        <Button variant='outline' size='sm' onClick={markAllAsRead} disabled={unreadCount === 0}>
          Mark all as read
        </Button>
      </div>

      {isLoading ? (
        _renderSkeleton()
      ) : items.length === 0 ? (
        <Card className='border-dashed border-neutral-200 bg-white'>
          <CardContent className='py-8 text-center text-sm text-neutral-500'>No notifications yet.</CardContent>
        </Card>
      ) : (
        <div className='flex flex-col gap-3'>{items.map((item, index) => _renderItem(item, index))}</div>
      )}
    </div>
  )
}

export default UserActivity
