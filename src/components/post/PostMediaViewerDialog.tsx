import React, { useCallback, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { PostMediaItem } from '@/components/post/PostMediaScroller'

type PostMediaViewerDialogProps = {
  open: boolean
  items: PostMediaItem[]
  index: number
  fallbackType: string | null
  onOpenChange: () => void
  onPrev: () => void
  onNext: () => void
}

const PostMediaViewerDialog = React.memo(
  ({ open, items, index, fallbackType, onOpenChange, onPrev, onNext }: PostMediaViewerDialogProps) => {
    const current = items[index]

    const isVideo = useCallback(
      (item?: PostMediaItem) => {
        if (!item) return false
        if (item.contentType?.startsWith('video/')) return true
        if (item.resourceType === 'Video') return true
        if (fallbackType === 'Video') return true
        return false
      },
      [fallbackType]
    )

    const hasPrev = index > 0
    const hasNext = index < items.length - 1

    const title = useMemo(() => (items.length ? `Media ${index + 1}/${items.length}` : 'Media'), [index, items])

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='w-[96vw]! max-w-300! h-[92vh]! max-h-[92vh]! p-0! flex flex-col overflow-hidden'>
          <DialogHeader className='items-center px-4 pt-4 pb-2'>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className='flex flex-1 items-center justify-between w-full bg-white px-4 pb-4 pt-2'>
            <Button
              variant='outline'
              size='icon'
              className='rounded-full cursor-pointer'
              onClick={onPrev}
              disabled={!hasPrev}
              aria-label='Previous media'
            >
              <ChevronLeft className='h-4 w-4' />
            </Button>
            {current ? (
              isVideo(current) ? (
                <video
                  src={current.url}
                  className='h-130 max-h-full w-auto max-w-full object-contain'
                  controls
                  autoPlay
                />
              ) : (
                <img src={current.url} alt='Post media' className='h-130 max-h-full w-auto max-w-full object-contain' />
              )
            ) : null}
            <Button
              variant='outline'
              size='icon'
              className='rounded-full cursor-pointer'
              onClick={onNext}
              disabled={!hasNext}
              aria-label='Next media'
            >
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }
)

export default PostMediaViewerDialog
