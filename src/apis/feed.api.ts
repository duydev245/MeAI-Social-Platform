import { fetcher } from '@/apis/fetcher'
import type {
  TCreatePostPayload,
  TCreatePostResponse,
  TResult,
  TFeedCursor,
  TPostLikeResponse,
  TPostResponse,
  TReportPayload,
  TReportResponse,
  TUpdatePostPayload,
  TUpdatePostResponse
} from '@/models/feed.model'

type TFeedListResponse = TResult<TPostResponse[]>
type TPostLikeEnvelope = TResult<TPostLikeResponse>
type TReportEnvelope = TResult<TReportResponse>
type TDeletePostEnvelope = TResult<null>

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
  },

  async updatePost(postId: string, payload: TUpdatePostPayload) {
    const response = await fetcher.put<TUpdatePostResponse>(`/api/Feed/posts/${postId}`, payload)
    return response.data.value
  },

  async reportTarget(payload: TReportPayload) {
    const response = await fetcher.post<TReportEnvelope>('/api/Feed/reports', payload)
    return response.data.value
  },

  async deletePost(postId: string) {
    const response = await fetcher.delete<TDeletePostEnvelope>(`/api/Feed/posts/${postId}`)
    return response.data.value
  }
}
