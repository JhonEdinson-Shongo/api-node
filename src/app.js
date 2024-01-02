import express from "express"
import crypto from 'node:crypto'
import cors from 'cors'

import moviesJSON from "./movies.json" assert {type : 'json'}
import { validateMovie, validatePartialMovie } from './schemas/movieSchema.js'

const app = express()

app.use(express.json())
app.disable('x-powered-by')

// Solucionar CORS con el paquete de cors, si se deja cors() por defecto acepta todos los origenes
app.use(cors({
    origin: (origin, callback) => {
        // se puede hacer una consulta a la base de datos donde tengamos los origenes aceptados
        const ACCEPTED_ORIGINS = [
            'http://localhost:8080',
            'http://localhost:8081',
            'http://localhost:8082',
        ]
        if (!origin || ACCEPTED_ORIGINS.includes(origin)) {
            return callback(null, true)
        }
        return callback(new Error('Not allowed by CORS'))
    }
}))

////////////////////////////////////////////////////
//////////////// SOLUCIONAR CORS ///////////////////
////////////////////////////////////////////////////
/*
app.use((req, res, next) => {
    const ACCEPTED_ORIGINS = [
        'http://localhost:8080',
        'http://localhost:8081',
        'http://localhost:8082',
    ]
    const origin = req.header('origin')
    if (origin && ACCEPTED_ORIGINS.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin)
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
    }
    next()
})

// Métodos normales: GET/HEAD/POST
// Métodos complejos: PUT/PATCH/DELETE

// CORS PRE-Flight
// OPTIONS

app.options('', (req, res) => {
    // Aqui se espesifica la url a la que queremos ajustar el PRE-Flight
    // y alñadimos las cabeceras necesarias para esa URL, que seria lo mismo
    //que esta en el middleware a anteriormente
    res.send(200)
})
*/


app.get('/', (req, res) => {
    // Aceptamos todos los origenes con el *y si solo queremos recibir peticiones de un dominio, ponemos el dominio en el *.
    // res.header('Access-Control-Allow-Origin', '*') // solucionar problema de CORS para este metodo
    res.json({message: 'Welcome to movie api'})
})

app.get('/movies', (req, res) => {
    const { genre } = req.query
    if (genre) {
        // const moviesByGenre = moviesJSON.filter(movie => movie.genre.includes(genre)) // key sensitive
        const moviesByGenre = moviesJSON.filter(movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()))
        return res.json(moviesByGenre)
    }
    res.json(moviesJSON)
})

app.get('/movies/:id', (req, res) => { // path-to-regexp
    const { id } = req.params
    const movie = moviesJSON.find(movie => movie.id === id)
    if(movie) return res.json(movie)
    res.status(404).json({message: 'Movie not found'})
})

app.post('/movies', (req, res) => {
    const valRequestMovie = validateMovie(req.body)

    if (!valRequestMovie.success || valRequestMovie.error) {
        return res.status(400).json({
            error: JSON.parse(valRequestMovie.error.message)
        })
    }

    const newMovie = {
        id: crypto.randomUUID(),
        ...valRequestMovie
    }

    moviesJSON.push(newMovie)
    res.status(201).json(newMovie)
})

app.patch('/movies/:id', (req, res) => {
    const valRequestMovie = validatePartialMovie(req.body)
    
    if (!valRequestMovie.success || valRequestMovie.error) {
        return res.status(400).json({
            error: JSON.parse(valRequestMovie.error.message)
        })
    }
    
    const { id } = req.params
    const movieIndex = moviesJSON.findIndex(movie => movie.id === id)

    if (movieIndex === -1) {
        return res.status(400).json({
            message: 'Movie not found'
        })
    }

    const updateMovie = {
        ...moviesJSON[movieIndex],
        ...valRequestMovie.data
    }

    moviesJSON[movieIndex] = updateMovie

    return res.json(updateMovie)

})

const PORT = process.env.PORT ?? 3000
app.listen(PORT, () => console.log(`Server on port ${PORT}`))
