import { PATH } from '@/routes/path'
import { Navigate, useParams } from 'react-router'

function UserProfile() {
  const { username } = useParams()
  console.log('🚀 ~ UserProfile ~ username:', username)

  if (!username || !username.startsWith('@')) {
    return <Navigate to={PATH.HOME} replace />
  }

  return <div>UserProfile</div>
}

export default UserProfile
