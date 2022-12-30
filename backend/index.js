const express = require('express')
const cors = require('cors')

const routes = require('./routes')


const port = 9000
const app = express()
const server = require("http").createServer(app)

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ['GET', 'POST', 'HEAD']
    }
})

const controller_main_room = require('./src/controllers/controller_main_room')


app.use(cors())
app.use(express.json())
app.use(routes)

server.listen(9000, (req, res) => {
    console.log(`Server running at: http://localhost:${port}`)

    io.of('/game').on('connection', (socket) => {
        controller_main_room.indexGame(socket)
    })
})