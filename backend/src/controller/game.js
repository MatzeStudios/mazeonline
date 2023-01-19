// possible States:
// off
// starting
// running
// finishing
// end
const Player = require("../classes/player")
const Maze = require("../classes/maze")

const startCount = 3000

class Game {
    constructor(io) {
        this.io = io
        this.players = []
        this.maze = undefined
        this.state = 'off'
        this.startTime = -1

        this.updater = setInterval(() => this.updatePositions(), 50)

        this.io.on("connection", (socket) => this.newConnection(socket))
    }

    createMaze() {
        this.maze = new Maze(15,15,2)
        console.log("Maze created: ")
        this.maze.printConsole()
    }

    updatePositions() {
        this.io.emit("positions", this.players)
    }

    playerDisconnected(player) {
        let i = this.players.indexOf(player)
        if(i === -1) {
            console.log("Client disconnected, wasn't on players list.")
            return
        }

        this.players.splice(i, 1)
        this.io.emit("numPlayers", this.players.length)
        this.io.emit("playerDisconnected", player.id)

        console.log("Client disconnected, player removed.")

        if(this.players.length == 0) {
            console.log("No players left. State = off")
            this.state = 'off'
        }
    }

    newConnection(socket) {
        const player = new Player(socket.id)

        console.log("New client connected")

        socket.on("disconnect", () => this.playerDisconnected(player))

        socket.on("playerStart", data => { // player clicked 'play' button

            player.setNickname(data.nickname)
            player.setColor(data.color)
            
            this.players.push(player)
            
            this.io.emit("numPlayers", this.players.length)
            
            if(this.state == 'off') { // first player to connect
                this.state = 'starting'
                console.log("state = starting")
                this.createMaze()

                this.startTime = Date.now()
                
                setTimeout(() => {
                    if(this.state == 'starting') {
                        this.state = 'running'
                        console.log("state = running")
                    }
                }, startCount)
            }

            player.setInicialPosition(this.maze)

            console.log("New player added, players array:")
            console.log(this.players)
        })

        socket.on("getGameInfo", () => {
            if(this.players.indexOf(player) === -1) {
                socket.emit("gameInfo")
                return
            }

            const infoPackage = {}

            infoPackage.maze = this.maze
            infoPackage.state = this.state
            if(this.state === 'starting') infoPackage.startTime = startCount - (Date.now() - this.startTime)
            infoPackage.player = this.players[this.players.indexOf(player)]


            socket.emit("gameInfo", infoPackage)
        })

        socket.on("positionUpdate", data => {
            player.setPosition(data.x, data.y)
        })

        socket.on("getNumPlayers", () => {
            socket.emit("numPlayers", this.players.length)
        })
    } 
}

module.exports = Game