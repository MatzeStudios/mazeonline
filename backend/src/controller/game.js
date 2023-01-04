// off
// starting
// running
// finishing
// end

const Player = require("../classes/player")
const Maze = require("../classes/maze")

class Game {
    constructor(io) {
        this.io = io
        this.players = []
        this.createMaze(15, 15)

        this.updater = setInterval(() => this.updatePositions(), 50)

        this.io.on("connection", (socket) => this.newConnection(socket))
    }

    createMaze(w, h) {
        this.maze = new Maze(w,h,2)
    }

    updatePositions() {
        //if(gameRunning)
        this.io.emit("positions", this.players)
    }

    playerDisconnected(player) {
        console.log("Client disconnected")
        this.players.splice(this.players.indexOf(player), 1)
        this.io.emit("getNumPlayers", this.players.length)
    }

    newConnection(socket) {
        const player = new Player(socket.id)
        player.setInicialPosition(this.maze)

        this.io.emit("getNumPlayers", this.players.length)
        
        console.log("New client connected")

        socket.on("disconnect", () => this.playerDisconnected(player))

        socket.on("playerStart", data => {
            player.nickname = data
            this.players.push(player) 
            
            this.io.emit("getNumPlayers", this.players.length)
            
            if (this.players.length == 1) {
                socket.emit("startGame", true)
            }
        })

        socket.on("positionUpdate", data => {
            player.x = data.x
            player.y = data.y
        })

        socket.on("getMaze", () => {
            this.players.indexOf(player) != -1 ? socket.emit("getMaze", this.maze) : socket.emit("getMaze", undefined)
        })

        socket.on("getId", () => {
            socket.emit("getId", socket.id)
        })

        socket.on("getNumPlayers", () => {
            socket.emit("getNumPlayers", this.players.length)
        })
    } 
}

module.exports = Game