// possible States:
// off
// starting
// running
// finishing
// end
const Player = require("../classes/player")
const Maze = require("../classes/maze")

const startCount = 5_000
const endCount =  30_000

class Game {
    constructor(io) {
        this.io = io
        this.players = []
        this.maze = undefined
        this.state = 'off'
        this.startTime = -1

        this.finishers = []
        this.endStartTime = -1

        this.timeOverTimoutId = undefined

        this.updater = setInterval(() => this.updatePositions(), 50)

        this.io.on("connection", (socket) => this.newConnection(socket))
    }

    createMaze() {
        this.maze = new Maze(15,15,2)
        console.log("Maze created: ")
        this.maze.printConsole()

        this.players.forEach((player) => player.setInicialPosition(this.maze))
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

        if( this.state === 'finishing' && this.players.length !== 0 ) { // player left while the game was ending and there's still 
                                                                        // someone playing
            let j = this.finishers.indexOf(player)
            if(j != -1) { // was one of the players that finished
                this.finishers.splice(j, 1)
                
                if(this.finishers.length === 0) { // every finisher left -> cancel finish
                    this.state = 'running'
                    
                    this.finishers = []
                    this.endStartTime = -1

                    clearTimeout(this.timeOverTimoutId)

                    this.io.emit("cancelFinish")

                    console.log("All players that had finished left. Game is back to state = running. Finish Time cancelled.")
                }
            }
            else { // didn't finish before leaving
                if(this.finishers.length === this.players.length) { // everybody finished
                    this.gameEnd("Everybody finished. One of the players that hadn't finished yet left. state = end")
                }
            }
        } 

        if(this.players.length == 0) {
            console.log("No players left. State = off")
            this.state = 'off'

            this.finishers = []
            this.endStartTime = -1
        }
    }

    gameStart() {
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

        clearTimeout(this.timeOverTimoutId)
        
        this.finishers = []
        this.endStartTime = -1
    }

    gameEnd(message) {
        console.log(message)
        this.state = 'end'
        this.io.emit("gameEnd")

        setTimeout(() => {
            if(this.state === 'end') {
                this.gameStart()
                this.io.emit("nextGame")
            }
        }, 5_000)
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
                this.gameStart()
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
            if(this.state === 'finishing') infoPackage.endTime = endCount - (Date.now() - this.endStartTime)
            infoPackage.player = this.players[this.players.indexOf(player)]

            socket.emit("gameInfo", infoPackage)
        })

        socket.on("positionUpdate", data => {
            player.setPosition(data.x, data.y)
        })

        socket.on("getNumPlayers", () => {
            socket.emit("numPlayers", this.players.length)
        })

        socket.on("finished", () => {
            console.log("Player Finished: " + player.nickname)

            if(this.finishers.length === 0) { // first to finish

                this.state = 'finishing'
                console.log("First to finish. state = finishing")

                this.endStartTime = Date.now()
                this.io.emit("gameFinishing", endCount)

                this.timeOverTimoutId = setTimeout(() => {
                    if(this.state === 'finishing') {
                        this.gameEnd("Time over. state = end")
                    }
                }, endCount)
            }

            this.finishers.push(player)

            if(this.finishers.length === this.players.length) { // everybody finished
                this.gameEnd("Everybody finished. state = end")
            }
        })

        socket.on("getEndInfo", () => {
            if(this.players.indexOf(player) === -1) {
                socket.emit("endInfo")
                return
            }

            const infoPackage = {}

            infoPackage.finishers = this.finishers

            socket.emit("endInfo", infoPackage)
        })
    } 
}

module.exports = Game