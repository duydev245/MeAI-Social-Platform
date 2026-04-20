import { Loader2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { TPostResponse } from '@/models/feed.model'
import { feedApi } from '@/apis/feed.api'
import { feedKeys } from '@/hooks/use-feed'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'

type EditPostDialogProps = {
  open: boolean
  post: TPostResponse | null
  onOpenChange: (open: boolean) => void
}

function EditPostDialog({ open, post, onOpenChange }: EditPostDialogProps) {
  const queryClient = useQueryClient()
  const [content, setContent] = useState('')

  useEffect(() => {
    if (open && post) {
      setContent(post.content ?? '')
      return
    }

    if (!open) {
      setContent('')
    }
  }, [open, post])

  const canSubmit = useMemo(() => content.trim().length > 0, [content])
  const isDirty = useMemo(() => (post?.content ?? '') !== content, [content, post?.content])

  const updatePostMutation = useMutation({
    mutationFn: async () => {
      if (!post) {
        throw new Error('Missing post')
      }
      const trimmedContent = content.trim()
      if (!trimmedContent) {
        throw new Error('Missing content')
      }

      return feedApi.updatePost(post.id, { content: trimmedContent })
    },
    onSuccess: () => {
      toast.success('Post updated')
      queryClient.invalidateQueries({ queryKey: feedKeys.all })
      onOpenChange(false)
    },
    onError: () => {
      toast.error('Could not update post')
    }
  })

  const isBusy = updatePostMutation.isPending

  const handleOpenChange = (nextOpen: boolean) => {
    if (isBusy) return
    onOpenChange(nextOpen)
  }

  const handleSubmit = () => {
    if (!canSubmit || !isDirty || isBusy) return
    updatePostMutation.mutate()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className='w-[96vw] sm:max-w-xl max-h-[90vh] sm:max-h-[95vh] overflow-y-auto'
        showCloseButton={!isBusy}
        onInteractOutside={(event) => {
          if (isBusy) event.preventDefault()
        }}
        onEscapeKeyDown={(event) => {
          if (isBusy) event.preventDefault()
        }}
      >
        <DialogHeader className='items-center'>
          <DialogTitle>Edit post</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <Textarea
            placeholder='Update your post'
            className='w-full max-w-full resize-none whitespace-pre-wrap wrap-break-word'
            value={content}
            onChange={(event) => setContent(event.target.value)}
            disabled={isBusy}
          />
          <div className='flex justify-end gap-2'>
            <Button variant='outline' onClick={() => onOpenChange(false)} disabled={isBusy}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!canSubmit || !isDirty || isBusy}>
              {isBusy ? <Loader2 className='h-4 w-4 animate-spin' /> : null}
              Save changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EditPostDialog
