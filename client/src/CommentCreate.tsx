import axios from 'axios'
import { ChangeEvent, FC, useState } from 'react'
import { COMMENTS_URL } from './constants'

interface CommentCreateProps {
  postId: string
}

const CommentCreate: FC<CommentCreateProps> = ({ postId }) => {
  const [content, setContent] = useState<string>('')

  const handleChangeContent = (e: ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value)
  }

  const handleOnSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (content === '') return

    await axios.post(`${COMMENTS_URL}/posts/${postId}/comments`, {
      content
    })

    setContent('')
  }

  return (
    <div>
      <form onSubmit={handleOnSubmit}>
        <div className='form-group'>
          <label htmlFor=''>New comment</label>
          <input value={content} type='text' className='form-control' onChange={handleChangeContent} />
        </div>
        <button className='btn btn-primary'>Submit</button>
      </form>
    </div>
  )
}

export default CommentCreate
