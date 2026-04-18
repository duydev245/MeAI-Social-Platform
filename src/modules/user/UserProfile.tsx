import { useParams } from 'react-router'

function UserProfile() {
  const { username } = useParams()
  console.log('🚀 ~ UserProfile ~ username:', username)

  return <div>UserProfile</div>
}

export default UserProfile
