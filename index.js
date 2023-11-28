const PORT = 4000
const express = require('express')
const cors = require('cors')
const app = express()
const dotenv = require('dotenv')
const { createServer } = require('node:http');

const server = createServer(app)
dotenv.config()

//ROUTES
const votes = require('./routes/votes')
const auth = require('./routes/auth')
const users = require('./routes/user')
const oauth = require('./routes/oauth')
const request = require('./routes/request')

//BODY PARSER
app.use(express.json())

//CORS

const whitelist = ['https://voting-app-fe.onrender.com/'] //, 'http://developer2.com']
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error())
        }
    }
}

app.use(cors(corsOptions))

//MONGOOSE
require('./config/mongoose')


//ENDPOINTS
app.use('/api/votes', votes)
app.use('/api/auth', auth)
app.use('/api/users', users)
app.use('/api/oauth', oauth)
app.use('/api/request', request)

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
