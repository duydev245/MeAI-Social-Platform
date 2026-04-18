import { profileApi } from '@/apis/profile.api'
import { useQuery } from '@tanstack/react-query'

function PostFeed() {
  const { data: userData } = useQuery({
    queryKey: ['auth-me'],
    queryFn: () => profileApi.getMe(),
    retry: false,
    refetchOnWindowFocus: false
  })
  console.log('🚀 ~ PostFeed ~ userData:', userData)

  return <div>PostFeed</div>
}

export default PostFeed
