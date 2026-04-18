import { fetcher } from "@/apis/fetcher";
import type { TGetMeResponse } from "@/models/profile.model";

export const profileApi = {
  async getMe(): Promise<TGetMeResponse> {
    try {
      const res = await fetcher.get('/api/User/auth/me');
      return res.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  }
}