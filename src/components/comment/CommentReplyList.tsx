import { memo } from 'react'
import type { TCommentResponse } from '@/models/feed.model'
import CommentReplyItem from '@/components/comment/CommentReplyItem'

type CommentReplyListProps = {
  rootReplies: TCommentResponse[]
  repliesByParent: Map<string, TCommentResponse[]>
  isAuthed: boolean
  currentUsername: string | null
  isPostOwner: boolean
  isSameUsername: (left: string | null, right: string | null) => boolean
  onReportComment: (comment: TCommentResponse) => void
  onRequireAuth: () => void
  onToggleLike: (reply: TCommentResponse) => void
  onReplyTo: (reply: TCommentResponse) => void
  onDelete: (reply: TCommentResponse) => void
  likeBusyId: string | null
  isDeleteBusy: boolean
}

const CommentReplyList = memo(
  ({
    rootReplies,
    repliesByParent,
    isAuthed,
    currentUsername,
    isPostOwner,
    isSameUsername,
    onReportComment,
    onRequireAuth,
    onToggleLike,
    onReplyTo,
    onDelete,
    likeBusyId,
    isDeleteBusy
  }: CommentReplyListProps) => (
    <div className='flex flex-col gap-3'>
      {rootReplies.map((reply) => {
        const children = repliesByParent.get(reply.id) ?? []
        const isOwner = isSameUsername(reply.username, currentUsername)
        const canDelete = isOwner || isPostOwner
        const canReport = !isOwner

        return (
          <div key={reply.id} className='space-y-3'>
            <CommentReplyItem
              reply={reply}
              isAuthed={isAuthed}
              currentUsername={currentUsername}
              canDelete={canDelete}
              canReport={canReport}
              onReportComment={onReportComment}
              onRequireAuth={onRequireAuth}
              onToggleLike={onToggleLike}
              onReplyTo={onReplyTo}
              onDelete={onDelete}
              isLikeBusy={likeBusyId === reply.id}
              isDeleteBusy={isDeleteBusy}
            />
            {children.length ? (
              <div className='space-y-3 border-l border-neutral-200 pl-4'>
                {children.map((child) => {
                  const childOwner = isSameUsername(child.username, currentUsername)
                  const childCanDelete = childOwner || isPostOwner
                  const childCanReport = !childOwner

                  return (
                    <CommentReplyItem
                      key={child.id}
                      reply={child}
                      isAuthed={isAuthed}
                      currentUsername={currentUsername}
                      canDelete={childCanDelete}
                      canReport={childCanReport}
                      onReportComment={onReportComment}
                      onRequireAuth={onRequireAuth}
                      onToggleLike={onToggleLike}
                      onReplyTo={onReplyTo}
                      onDelete={onDelete}
                      isLikeBusy={likeBusyId === child.id}
                      isDeleteBusy={isDeleteBusy}
                    />
                  )
                })}
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
)

CommentReplyList.displayName = 'CommentReplyList'

export default CommentReplyList
