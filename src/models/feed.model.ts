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
