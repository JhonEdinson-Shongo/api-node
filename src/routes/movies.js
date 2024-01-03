import { Router } from 'express'

import { MovieController } from '../controllers/movieControler.js'

export const moviesRouter = Router()

moviesRouter.get('/', MovieController.getAll)

moviesRouter.get('/:id', MovieController.getById) // path-to-regexp

moviesRouter.post('/', MovieController.create)

moviesRouter.patch('/:id', MovieController.update)
