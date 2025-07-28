import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import config from './config/env'
import { apiLimiter } from './infrastructure/http/middlewares/rate-limit'
import routes from './infrastructure/http/routes'
import requestIp from 'request-ip'

const app = express()

app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://biangg.vercel.app' || 'https://www.biangg.ca',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet())
app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(apiLimiter)
app.use(requestIp.mw())
app.use('/api/v1', routes)

app.use((req, res, next) => {
  if (req.url === '/favicon.ico') {
    res.status(204).end()
  } else {
    next()
  }
})

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ success: false, message: 'Internal server error' })
})

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT} in ${config.NODE_ENV} mode`)
})

export default app