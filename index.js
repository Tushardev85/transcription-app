import express from 'express'
import dotenv from 'dotenv'
import transcriptRoutes from './routes/transcript.js'

// Initialize environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 8000

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/transcript', transcriptRoutes)

app.get('/', (req, res) => {
    res.status(200).json({
        message: "Transcript app is running."
    })
})

app.listen(PORT, () => {
    console.log("Server listening on port", PORT)
})