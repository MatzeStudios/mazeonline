const express = require("express")
const http = require("http")
const socketIo = require("socket.io")

const port = process.env.PORT || 9000
const index = require("./routes/index")

const Player = require("./src/classes/player")
const Maze = require("./src/classes/maze")

const app = express()
app.use(index)

const httpServer = http.createServer(app)

const io = new socketIo.Server(httpServer, {
    cors: {
        origin: ["http://10.244.151.77:3000", "http://localhost:3000"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
})

let next_id = 1

let maze = new Maze(15,15,2)

const players = []

setInterval(() => {
    console.log(players)
}, 1000)


io.on("connection", (socket) => {
    let interval;
    let player = new Player(next_id)

    if(next_id == 1000) next_id = 0
    next_id++

    players.push(player)

    console.log("New client connected")

    interval = setInterval(() => {
        socket.emit("positions", players);
    }, 50)

    socket.on("disconnect", () => {
        console.log("Client disconnected")
        players.splice(players.indexOf(player), 1);
        clearInterval(interval)
    })

    socket.on("nameDefine", data => {
        player.nickname = data
    })

    socket.on("positionUpdate", data => {
        player.x = data.x
        player.y = data.y
    })

    socket.on("getMaze", () => {
        socket.emit("getMaze", maze)
    })
})

httpServer.listen(port, () => console.log(`Listening on port ${port}`))