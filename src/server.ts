require('dotenv').config()
import express, { Request, Response } from 'express'
import * as Sentry from "@sentry/node"
import "@sentry/tracing"

const app = express()

app.use(express.json())

Sentry.init({
  dsn: process.env.SENTRY_DNS,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
})

app.use(Sentry.Handlers.tracingHandler());

app.get('/:statusCode', (request: Request, response: Response) => {
  const { statusCode } = request.params
  if(Number(statusCode) >= 400) {
    throw new Error('Error ' + statusCode)
  }
  return response.status(Number(statusCode)).json({
    statusCode: 'Test error ' + statusCode
  })
})

app.use(Sentry.Handlers.errorHandler());

app.listen(4000, () => console.log('Server is running...'))