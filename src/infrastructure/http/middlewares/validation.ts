import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'

export const validateRegisterInput = [
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  }
]

// Adicione mais validações conforme necessário