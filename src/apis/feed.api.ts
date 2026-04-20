import { fetcher } from '@/apis/fetcher'
import type {
  TCreatePostPayload,
  TCreatePostResponse,
  TResult,
  TFeedCursor,
  TPostLikeResponse,
  TPostResponse
} from '@/models/feed.model'

type TFeedListResponse = TResult<TPostResponse[]>
type TPostLikeEnvelope = TResult<TPostLikeResponse>

export const feedApi = {
  async getFeed(params: TFeedCursor) {
    const response = await fetcher.get<TFeedListResponse>('/api/Feed/posts/feed', { params })
    return response.data.value ?? []
  },

  async createPost(payload: TCreatePostPayload) {
    const response = await fetcher.post<TCreatePostResponse>('/api/Feed/posts', payload)
    return response.data.value
  },

  async likePost(postId: string) {
    const response = await fetcher.post<TPostLikeEnvelope>(`/api/Feed/posts/${postId}/like`)
    return response.data.value
  },

  async unlikePost(postId: string) {
    const response = await fetcher.delete<TPostLikeEnvelope>(`/api/Feed/posts/${postId}/like`)
    return response.data.value
  }
}
