const express = require("express")
const http = require("http")
const socketIo = require("socket.io")

require('dotenv').config()

const port = process.env.PORT || 9000
const index = require("./routes/index")

const Game = require("./src/controller/game")

const app = express()
app.use(index)

const httpServer = http.createServer(app)

const io = new socketIo.Server(httpServer, {
    cors: {
        origin: [process.env.FRONT_IP],
        allowedHeaders: ["mazeonline_header"],
        credentials: true
    }
})

const game = new Game(io)

httpServer.listen(port, () => console.log(`Listening on port ${port}`))