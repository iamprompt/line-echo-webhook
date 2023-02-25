import { Client, WebhookRequestBody } from '@line/bot-sdk'
import fastify, { FastifyRequest } from 'fastify'

import { config } from 'dotenv'

config()

const server = fastify()

const LINE_CHANNEL_ACCESS_TOKEN_ENV = process.env.LINE_CHANNEL_ACCESS_TOKEN

if (!LINE_CHANNEL_ACCESS_TOKEN_ENV) {
  throw new Error('LINE_CHANNEL_ACCESS_TOKEN is not defined')
}

let LINE_CHANNEL_ACCESS_TOKEN: string | { [key: string]: string }

try {
  LINE_CHANNEL_ACCESS_TOKEN = JSON.parse(LINE_CHANNEL_ACCESS_TOKEN_ENV)
} catch (error) {
  LINE_CHANNEL_ACCESS_TOKEN = LINE_CHANNEL_ACCESS_TOKEN_ENV
}

const LINEInstance = typeof LINE_CHANNEL_ACCESS_TOKEN === 'string' ? {
  default: new Client({
    channelAccessToken: LINE_CHANNEL_ACCESS_TOKEN,
  })
} : {
  ...Object.entries(LINE_CHANNEL_ACCESS_TOKEN).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: new Client({
        channelAccessToken: value,
      }),
    }
  }, {}),
}

server.get('/', async (request, reply) => {
  return { payload: 'Server is running' }
})

server.post('/webhook', async (request: FastifyRequest<{ Body: WebhookRequestBody }>, reply) => {
  const { body } = request

  console.log('body', body)

  const activeLINEInstance = LINEInstance[body.destination] || LINEInstance.default

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

    activeLINEInstance.replyMessage(event.replyToken, {
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
