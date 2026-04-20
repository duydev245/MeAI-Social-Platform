export type TResult<T> = {
  value: T
  isSuccess: boolean
  isFailure: boolean
  error?: {
    code: string
    description: string
  }
}

export type TFeedCursor = {
  cursorCreatedAt?: string
  cursorId?: string
  limit?: number
}

export type TPostMediaResponse = {
  resourceId: string
  presignedUrl: string
  contentType: string
  resourceType: string
}

export type TPostResponse = {
  id: string
  userId: string
  username: string
  avatarUrl: string | null
  content: string | null
  mediaUrl: string | null
  mediaType: string | null
  media: TPostMediaResponse[]
  likesCount: number
  commentsCount: number
  sharesCount: number
  hashtags: string[]
  createdAt: string | null
  updatedAt: string | null
  isLikedByCurrentUser: boolean | null
  canDelete: boolean | null
}

export type TPostLikeResponse = {
  postId: string
  likesCount: number
  isLikedByCurrentUser: boolean
}

export type TPostMediaType = 'Image' | 'Video' | null

export type TCreatePostPayload = {
  content: string | null
  resourceIds: string[]
  mediaType: TPostMediaType
}

export type TCreatePostResponse = TResult<TPostResponse>

export type TDeletePostResponse = TResult<null>

export type TUpdatePostPayload = {
  content: string | null
  resourceIds: string[]
  mediaType: TPostMediaType
}

export type TUpdatePostResponse = TResult<TPostResponse>

export type TReportTargetType = 'Post' | 'Comment'

export type TReportPayload = {
  targetType: TReportTargetType
  targetId: string
  reason: string
}

export type TReportResponse = {
  id: string
  reporterId: string
  targetType: TReportTargetType
  targetId: string
  reason: string
  status: string
  reviewedByAdminId: string | null
  reviewedAt: string | null
  resolutionNote: string | null
  actionType: string | null
  createdAt: string | null
  updatedAt: string | null
}
