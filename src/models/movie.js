import { readJSON } from '../utils.js'
import crypto from 'node:crypto'

const moviesJSON = readJSON('./movies.json')

export class MovieModel {
    static async getAll ({ genre }) {
        if (genre) {
            const moviesByGenre = moviesJSON.filter(movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()))
            return moviesByGenre
        }
        return moviesJSON
    }

    static async getById ({ id }) {
        const movie = moviesJSON.find(movie => movie.id === id)
        return movie
    }

    static async create ({ input }) {
        const newMovie = {
            id: crypto.randomUUID(),
            ...input
        }
        moviesJSON.push(newMovie)
        return newMovie
    }

    static async update ({ id, input }) {
        let updateMovie = null
        const movieIndex = moviesJSON.findIndex(movie => movie.id === id)
        if (movieIndex != -1) {
            updateMovie = {
                ...moviesJSON[movieIndex],
                ...input
            }        
            moviesJSON[movieIndex] = updateMovie
        }
        return updateMovie
    }
}

