import axios from 'axios'
import { FC, useState, useEffect, useCallback } from 'react'
import { COMMENTS_URL } from './constants'

interface IComment {
  id: string
  content: string
}


interface CommentListProps {
  postId: string
}

const CommentList: FC<CommentListProps> = ({
  postId
}) => {
  const [comments, setComments] = useState<IComment[]>([])

  const fetchPosts = useCallback(async () => {
    const res = await axios.get(`${COMMENTS_URL}/posts/${postId}/comments`)
    setComments(res.data)
  }, [postId])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  return (
    <div>
      <h4>Comments</h4>
      <ul>
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </ul>
    </div>
  )
}

const CommentItem: FC<{ comment: IComment }> = ({ comment }) => {
  return (
    <li>{comment.content}</li>
  )
}

export default CommentList
