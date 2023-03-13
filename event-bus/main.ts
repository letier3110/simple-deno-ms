import { Application, Router, RouterContext } from 'https://deno.land/x/oak/mod.ts'
import { config } from 'https://deno.land/x/dotenv/mod.ts'

const {
  PORT,
  POSTS_SERVICE_HOST,
  POSTS_SERVICE_PORT,
  COMMENTS_SERVICE_HOST,
  COMMENTS_SERVICE_PORT,
  AGGREGATION_SERVICE_HOST,
  AGGREGATION_SERVICE_PORT
} = config()

// curl -POST -H "Content-Type: application/json" -d '{"content":"wrld"}' 'http://localhost:4001/posts/123/comments'
//  curl -i -H "Accept: application/json" 'http://localhost:4001/posts/123/comments'
const app = new Application()

// add get route for GET all posts

const router = new Router()

const sendEvent = async (ctx: RouterContext<'/posts'>) => {
  if (!ctx.request.hasBody) {
    ctx.throw(415)
  }
  const event = await await ctx.request.body({ type: 'json' }).value

  fetch(`http://${POSTS_SERVICE_HOST}:${POSTS_SERVICE_PORT}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(event)
  })

  fetch(`http://${COMMENTS_SERVICE_HOST}:${COMMENTS_SERVICE_PORT}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(event)
  })

  fetch(`http://${AGGREGATION_SERVICE_HOST}:${AGGREGATION_SERVICE_PORT}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(event)
  });

  ctx.response.status = 201
  // ctx.response.body = event
  // ctx.response.type = 'json'
}

router.post('/events', sendEvent)

app.use(router.allowedMethods())
app.use(router.routes())

await app.listen({ port: PORT })
