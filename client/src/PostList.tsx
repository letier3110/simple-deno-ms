import axios from 'axios'
import { FC, useState, useEffect } from 'react'
import CommentCreate from './CommentCreate'
import CommentList from './CommentList'
import { POSTS_URL } from './constants'

interface IPost {
  id: string
  title: string
}

const PostList: FC = () => {
  const [posts, setPosts] = useState<Record<string, IPost>>({})

  const fetchPosts = async () => {
    const res = await axios.get(`${POSTS_URL}/posts`)
    setPosts(res.data)
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const renderPosts = Object.values(posts)

  return (
    <div>
      <h1>Post List</h1>
      <div className='d-flex flex-column flex-wrap justify-content-between'>
        {renderPosts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}

const PostItem: FC<{ post: IPost }> = ({ post }) => {
  return (
    <div className='card' style={{ width: '100%', marginBottom: '20px' }}>
      <div className='card-body'>
        <h3>{post.title}</h3>
        <hr />
        <CommentCreate postId={post.id} />
        <hr />
        <CommentList postId={post.id} />
      </div>
    </div>
  )
}

export default PostList
