import axios from 'axios'
import { ChangeEvent, FC, useState } from 'react'

const PostCreate: FC = () => {
  const [title, setTitle] = useState<string>('')

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleOnSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(title === '') return

    await axios.post('http://localhost:4000/posts', {
      title
    })

    setTitle('')
  }

  return (
    <div>
      <form onSubmit={handleOnSubmit}>
        <div className='form-group'>
          <label htmlFor=''>Title</label>
          <input value={title} type='text' className='form-control' onChange={handleChangeTitle} />
        </div>
        <button className='btn btn-primary'>Submit</button>
      </form>
    </div>
  )
}

export default PostCreate
