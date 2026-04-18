import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

type CreatePostDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function CreatePostDialog({ open, onOpenChange }: CreatePostDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Create post</DialogTitle>
          <DialogDescription>Share an update with your followers.</DialogDescription>
        </DialogHeader>
        <Textarea placeholder='What is happening right now?' className='min-h-32' />
        <DialogFooter className='gap-2'>
          <DialogClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DialogClose>
          <Button>Post</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreatePostDialog
