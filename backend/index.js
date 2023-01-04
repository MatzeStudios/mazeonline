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

let maze = new Maze(15,15,2)

const players = []

setInterval(() => {
    console.log(players)
}, 1000)

const updater = setInterval(() => {
    // if(gameRunning)
    io.emit("positions", players)
}, 50)

io.on("connection", (socket) => {
    let player = new Player(socket.id)
    player.setInicialPosition(maze)

    players.push(player)
    
    console.log("New client connected")

    socket.on("disconnect", () => {
        console.log("Client disconnected")
        players.splice(players.indexOf(player), 1)
        io.emit("getNumPlayers", players.length)
    })

    socket.on("nameDefine", data => {
        player.nickname = data
    })

    socket.on("positionUpdate", data => {
        player.x = data.x
        player.y = data.y
    })

    socket.on("playerStart", () => {
        players.push(player) 

        if (players.length == 1) {
            socket.emit("startGame", true)
        }
    })

    socket.on("getMaze", () => {
        socket.emit("getMaze", maze)
    })

    socket.on("getId", () => {
        socket.emit("getId", socket.id)
    })

    socket.on("getNumPlayers", () => {
        socket.emit("getNumPlayers", players.length)
    })

})

httpServer.listen(port, () => console.log(`Listening on port ${port}`))