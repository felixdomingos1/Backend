import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import config from './src/config/env'
import { apiLimiter } from './src/infrastructure/http/middlewares/rate-limit'
import routes from './src/infrastructure/http/routes'

const app = express()

app.use(cors())
app.use(helmet())
app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(apiLimiter)

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

// Start server
app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT} in ${config.NODE_ENV} mode`)
})

export default app