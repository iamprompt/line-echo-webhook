import { Client, WebhookRequestBody } from '@line/bot-sdk'
import fastify, { FastifyRequest } from 'fastify'

import { config } from 'dotenv'

config()

const server = fastify()

const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN

if (!LINE_CHANNEL_ACCESS_TOKEN) {
  throw new Error('LINE_CHANNEL_ACCESS_TOKEN is not defined')
}

const LINEClient = new Client({
  channelAccessToken: LINE_CHANNEL_ACCESS_TOKEN,
})

server.get('/', async (request, reply) => {
  return { payload: 'Server is running' }
})

server.post('/webhook', async (request: FastifyRequest<{ Body: WebhookRequestBody }>, reply) => {
  const { body } = request

  console.log('body', body)

  for (const event of body?.events || []) {
    if (
      event.type === 'unfollow' ||
      event.type === 'leave' ||
      event.type === 'accountLink' ||
      event.type === 'things' ||
      event.type === 'unsend' ||
      event.type === 'memberLeft'
    ) {
      continue
    }

    LINEClient.replyMessage(event.replyToken, {
      type: 'text',
      text: JSON.stringify(event, null, 2),
    })
  }

  return { payload: 'Webhook received' }
})

server.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`server listening on ${address}`)
})
