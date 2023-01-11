const express = require("express")
const http = require("http")
const socketIo = require("socket.io")

const port = process.env.PORT || 9000
const index = require("./routes/index")

const Game = require("./src/controller/game")

const app = express()
app.use(index)

const httpServer = http.createServer(app)

const io = new socketIo.Server(httpServer, {
    cors: {
        origin: ["http://192.168.0.100:3000", "http://localhost:3000", "http://10.244.151.77:3000", "http://10.244.234.230:3000"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
})

let game = new Game(io)

httpServer.listen(port, () => console.log(`Listening on port ${port}`))