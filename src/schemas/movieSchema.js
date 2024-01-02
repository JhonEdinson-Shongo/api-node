import z from 'zod'

const movieSchema = z.object({
    title: z.string({
        invalid_type_error: 'Movie title must be a string',
        required_error: 'Movie title is required',
    }),
    year: z.number({
        invalid_type_error: 'Movie year must be a string',
        required_error: 'Movie year is required',
    }).int().min(1900).max(2024),
    director: z.string({
        invalid_type_error: 'Movie director must be a string',
        required_error: 'Movie director is required',
    }),
    duration: z.number({
        invalid_type_error: 'Movie duration must be a number',
        required_error: 'Movie duration is required',
    }).int().positive(),
    poster: z.string({
        invalid_type_error: 'Movie poster must be a string',
        required_error: 'Movie poster is required',
    }).url(),
    genre: z.array(
        z.enum([
            'Drama',
            'Action',
            'Crime',
            'Adventure',
            'Sci-Fi',
            'Romance',
            'Animation',
            'Biography',
            'Fantasy'
        ])
    ),
    rate: z.number({
        invalid_type_error: 'Movie duration must be a number',
        required_error: 'Movie duration is required',
    }).positive().min(0).max(10).default(0.1),
})

export const validateMovie = function (object) {
    return movieSchema.safeParse(object)
}

export const validatePartialMovie = function (object) {
    return movieSchema.partial().safeParse(object)
}
