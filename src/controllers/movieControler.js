import { MovieModel } from '../models/movie.js'
import { validateMovie, validatePartialMovie } from '../schemas/movieSchema.js'

export class MovieController {
    static async getAll(req, res) {
        const { genre } = req.query
        const movies = await MovieModel.getAll({ genre })
        res.json(movies)
    }
    static async getById(req, res) {
        const { id } = req.params
        const movie = await MovieModel.getById({id})
        if(movie) return res.json(movie)
        res.status(404).json({message: 'Movie not found'})
    }

    static async create(req, res) {
        const valRequestMovie = validateMovie(req.body)
    
        if (!valRequestMovie.success || valRequestMovie.error) {
            return res.status(400).json({
                error: JSON.parse(valRequestMovie.error.message)
            })
        }

        const newMovie = await MovieModel.create({ input: valRequestMovie })
        res.status(201).json(newMovie)
    }

    static async update(req, res) {
        const valRequestMovie = validatePartialMovie(req.body)
        
        if (!valRequestMovie.success || valRequestMovie.error) {
            return res.status(400).json({
                error: JSON.parse(valRequestMovie.error.message)
            })
        }
        
        const { id } = req.params
        const updateMovie = await MovieModel.update({ id: id, input: valRequestMovie.data })
    
        if (!updateMovie)  return res.status(404).json({ message: 'Movie not found' })
    
        return res.json(updateMovie)
    
    }
}