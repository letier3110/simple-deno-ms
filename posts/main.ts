import { encode as he, decode as hd } from 'https://deno.land/std/encoding/hex.ts'
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { Application, Router, RouterContext } from 'https://deno.land/x/oak/mod.ts'

// curl -POST -H "Content-Type: application/json" -d '{"title":"wrld"}'
//  curl -i -H "Accept: application/json" 'http://localhost:4000/posts'
const app = new Application()

// add get route for GET all posts

const router = new Router()

interface PostEntity {
  id: string
  title: string
}

const posts: Record<string, PostEntity> = {}

const te = (s: string) => new TextEncoder().encode(s)
const td = (d: Uint8Array) => new TextDecoder().decode(d)

const createPost = async (ctx: RouterContext<'/posts'>) => {
  if (!ctx.request.hasBody) {
    ctx.throw(415)
  }
  const id = crypto.getRandomValues(new Uint32Array(4)).toString()
  const hId = td(he(te(id)))

  const { title } = await await ctx.request.body({ type: 'json' }).value

  posts[hId] = { title, id: hId }

  ctx.response.status = 201
  ctx.response.body = posts[hId]
  ctx.response.type = 'json'
}

router.get('/posts', (ctx) => {
  ctx.response.body = JSON.stringify(posts)
})

router.post('/posts', createPost)

// app.use((ctx) => {
//   ctx.response.body = 'Hello world!'
// })

app.use(oakCors({
  origin: /^.+localhost:(3000)$/,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}))
app.use(router.allowedMethods())
app.use(router.routes())

await app.listen({ port: 4000 })
