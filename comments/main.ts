import { encode as he, decode as hd } from 'https://deno.land/std/encoding/hex.ts'
import { Application, Router, RouterContext } from 'https://deno.land/x/oak/mod.ts'

// curl -POST -H "Content-Type: application/json" -d '{"content":"wrld"}' 'http://localhost:4001/posts/123/comments'
//  curl -i -H "Accept: application/json" 'http://localhost:4001/posts/123/comments'
const app = new Application()

// add get route for GET all posts

const router = new Router()
interface CommentEntity {
  id: string
  content: string
}

interface PostEntity {
  id: string
  comments: CommentEntity[]
}

const posts: Record<string, PostEntity> = {}

const te = (s: string) => new TextEncoder().encode(s)
const td = (d: Uint8Array) => new TextDecoder().decode(d)

const createComment = async (ctx: RouterContext<'/posts'>) => {
  if (!ctx.request.hasBody) {
    ctx.throw(415)
  }
  const id = crypto.getRandomValues(new Uint32Array(4)).toString()
  const commentId = td(he(te(id)))

  const postId = ctx.params.id

  const { content } = await await ctx.request.body({ type: 'json' }).value

  const comments = posts[postId]?.comments || []

  comments.push({ id: commentId, content })

  posts[postId] = { id: postId, comments }

  ctx.response.status = 201
  ctx.response.body = JSON.stringify(comments)
  ctx.response.type = 'json'
}

router.get('/posts/:id/comments', (ctx) => {
  // ctx.params.id
  const postId = ctx.params.id
  const comments = posts[postId]?.comments || []
  ctx.response.body = JSON.stringify(comments)
})

router.post('/posts/:id/comments', createComment)

app.use(router.allowedMethods())
app.use(router.routes())

await app.listen({ port: 4001 })
