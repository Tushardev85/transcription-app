import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import transcriptRoutes from './routes/transcript.js'
import authRoutes from './routes/auth.js'
import callRouter from './routes/call.js'

// Initialize environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 8080

// CORS configuration
const allowedOrigins = [
    'http://localhost:3000',
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, postman)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}

// Middleware
app.use(cors(corsOptions)) // Enable CORS with specific options
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Debug logging
console.log('Registering routes...')

// Routes
app.use('/api/transcript', transcriptRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/auth/refresh-token', authRoutes)
app.use('/call', callRouter)

app.get('/', (req, res) => {
    res.status(200).json({
        message: "Transcript app is running."
    })
})

app.listen(PORT, () => {
    console.log("Server listening on port", PORT)
})