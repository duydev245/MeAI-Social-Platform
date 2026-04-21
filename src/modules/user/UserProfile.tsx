import { PATH } from '@/routes/path'
import { Navigate, useParams } from 'react-router'

const AVATAR_EXTENSIONS = new Set(['image/png', 'image/jpeg', 'image/jpg'])
const MAX_FILE_SIZE = 15 * 1024 * 1024 // 15 MB
const PHONE_PREFIX = '+84'
const PHONE_PREFIX_DIGITS = '84'

function normalizePhoneDigits(value: string | null | undefined) {
  if (!value) return ''
  const digits = value.replace(/\D/g, '')
  let next = digits

  if (next.startsWith(PHONE_PREFIX_DIGITS)) {
    const hasPrefix = value.trim().startsWith('+') || next.length > 9
    if (hasPrefix) {
      next = next.slice(PHONE_PREFIX_DIGITS.length)
    }
  }

  if (next.startsWith('0')) {
    next = next.slice(1)
  }

  return next.slice(0, 13)
}

function toPhonePayload(digits: string) {
  return digits ? `${PHONE_PREFIX}${digits}` : null
}

function UserProfile() {
  const { username } = useParams()
  console.log('🚀 ~ UserProfile ~ username:', username)

  if (!username || !username.startsWith('@')) {
    return <Navigate to={PATH.HOME} replace />
  }

  return <div>UserProfile</div>
}

export default UserProfile
