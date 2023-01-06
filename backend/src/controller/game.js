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
    }

    updatePositions() {
        //if(gameRunning)
        this.io.emit("positions", this.players)
    }

    playerDisconnected(player) {
        console.log("Client disconnected")
        this.players.splice(this.players.indexOf(player), 1)
        this.io.emit("getNumPlayers", this.players.length)

        if(this.players.length == 0) this.state = 'off'
    }

    newConnection(socket) {
        const player = new Player(socket.id)

        this.io.emit("getNumPlayers", this.players.length)
        
        console.log("New client connected")

        socket.on("disconnect", () => this.playerDisconnected(player))

        socket.on("playerStart", data => { // player clicked 'play' button
            player.nickname = data.trim() == '' ? 'Unnamed' : data.trim()
            this.players.push(player) 
            
            this.io.emit("getNumPlayers", this.players.length)
            
            if(this.state == 'off') { // first player to connect
                this.state = 'starting'
                this.createMaze()

                this.startTime = Date.now()
                socket.emit("gameStarting", startCount)
                
                setTimeout(() => {if(this.state == 'starting') this.state = 'running'}, startCount)
            }
            else if(this.state == 'starting') { // joined while game is starting
    
                socket.emit("gameStarting", startCount - (Date.now() - this.startTime))
            }
            else if(this.state == 'running') { // joined while game is running
    
                socket.emit("gameRunning")
            }

            player.setInicialPosition(this.maze)
        })

        socket.on("positionUpdate", data => {
            player.setPosition(data.x, data.y)
            player.setVelocity(data.vx, data.vy, data.running)
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