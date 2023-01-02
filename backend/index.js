const express = require("express")
const http = require("http")
const socketIo = require("socket.io")

const port = process.env.PORT || 9000
const index = require("./routes/index")

const app = express()
app.use(index)

const httpServer = http.createServer(app)

const io = new socketIo.Server(httpServer, {
    cors: {
        origin: "http://10.244.151.77:3000",
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});



class Player {
    constructor() {
        this.x = 0
        this.y = 0
        this.nickname = "Unnamed"
    }
}

const players = []

io.on("connection", (socket) => {
    let interval;
    let player = new Player()
    players.push(player)

    console.log("New client connected")

    interval = setInterval(() => {
        socket.emit("positions", players);
    }, 50);

    socket.on("disconnect", () => {
        console.log("Client disconnected")
        players.splice(players.indexOf(player), 1);
        clearInterval(interval)
    });

    socket.on("nameDefine", data => {
        player.nickname = data.name
    });

    socket.on("positionUpdate", data => {
        player.x = data.x
        player.y = data.y
    });
});

httpServer.listen(port, () => console.log(`Listening on port ${port}`))