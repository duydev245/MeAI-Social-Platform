import type { TProfile } from '@/models/profile.model'

export interface IRoleState {
  currentRole: string
}

export interface ICurrentUserState {
  currentUser: TProfile | null
}
