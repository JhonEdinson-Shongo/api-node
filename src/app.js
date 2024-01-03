import express from 'express'
import { moviesRouter } from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'

const app = express()

app.use(express.json())
app.disable('x-powered-by')

// Solucionar CORS con el paquete de cors, si se deja cors() por defecto acepta todos los origenes
app.use(corsMiddleware())

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

////////////////////////////////////////////////////
////////////////////// Routes //////////////////////
////////////////////////////////////////////////////

app.get('/', (req, res) => {
    // Aceptamos todos los origenes con el *y si solo queremos recibir peticiones de un dominio, ponemos el dominio en el *.
    // res.header('Access-Control-Allow-Origin', '*') // solucionar problema de CORS para este metodo
    res.json({message: 'Welcome to movie api'})
})

app.use('/movies', moviesRouter)

const PORT = process.env.PORT ?? 3000
app.listen(PORT, () => console.log(`Server on port ${PORT}`))
