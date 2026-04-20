import React from 'react'
import { Card, CardContent } from '@/components/ui/card'

const PostFeedEmptyState = React.memo(() => (
  <Card className='border-neutral-200 bg-white'>
    <CardContent className='text-sm text-neutral-600'>No posts yet. Follow someone or create a post.</CardContent>
  </Card>
))

export default PostFeedEmptyState
