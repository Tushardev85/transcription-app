import express from 'express'
import dotenv from 'dotenv'
import transcriptRoutes from './routes/transcript.js'
import authRoutes from './routes/auth.js'

// Initialize environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 8000

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Debug logging
console.log('Registering routes...')

// Routes
app.use('/api/transcript', transcriptRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/auth/refresh-token', authRoutes)
// console.log('Routes registered:', Object.keys(app._router.stack
//   .filter(r => r.route)
//   .map(r => r.route.path)))

app.get('/', (req, res) => {
    res.status(200).json({
        message: "Transcript app is running."
    })
})

app.listen(PORT, () => {
    console.log("Server listening on port", PORT)
})