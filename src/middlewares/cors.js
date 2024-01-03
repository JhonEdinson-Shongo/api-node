import cors from 'cors'

const ACCEPTED_ORIGINS = [
    'http://localhost:8080',
    'http://localhost:8081',
    'http://localhost:8082',
]

export const corsMiddleware = () => cors({
    origin: (origin, callback) => {
        // se puede hacer una consulta a la base de datos donde tengamos los origenes aceptados
        if (!origin || ACCEPTED_ORIGINS.includes(origin)) {
            return callback(null, true)
        }
        return callback(new Error('Not allowed by CORS'))
    }
})