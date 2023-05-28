// possible States:
// off
// starting
// running
// finishing
// end
const Player = require("../classes/player")
const Maze = require("../classes/maze")

const startCount = 3_000
const nextMatchCount = 10_000

const findById = (players, id) => {
    for(let i = 0; i < players.length; i++) {
        if(players[i].id === id) return i
    }
    return -1
}

const random_item = (items) => items[Math.floor(Math.random()*items.length)];

class Game {
    constructor(io) {
        this.io = io
        this.players = []
        this.maze = undefined
        this.state = 'off'
        this.startTime = -1

        this.mapOptions = [
            {width: 8, height: 8, name:'Mini', votes: [], endCount: 5_000, n_paths: 2, force_paths: false},
            {width: 16, height: 16, name:'Pequeno', votes: [], endCount: 15_000, n_paths: 2, force_paths: false},
            {width: 32, height: 32, name:'Médio', votes: [], endCount: 30_000, n_paths: 3, force_paths: true},
            {width: 64, height: 64, name:'Grande', votes: [], endCount: 60_000, n_paths: 5, force_paths: true},
            {width: 128, height: 128, name:'Gigante', votes: [], endCount: 120_000, n_paths: 6, force_paths: true},
            {width: 128, height: 16, name:'Estreito', votes: [], endCount: 45_000, n_paths: 4, force_paths: false}
        ]

        this.selectedMap = 0

        this.finishers = []
        this.endStartTime = -1
        this.endScreenTime = -1

        this.timeOverTimoutId = undefined

        this.refreshDelay = 50

        this.updater = setInterval(() => this.updatePositions(), this.refreshDelay)

        this.io.on("connection", (socket) => this.newConnection(socket))
    }

    getEndCount() {
        return this.mapOptions[this.selectedMap].endCount
    }

    createMaze() {
        let selected = this.mapOptions[this.selectedMap];

        this.maze = new Maze(selected.width, selected.height, selected.n_paths, selected.force_paths)
        console.log("Maze created: ")
        this.maze.printConsole()

        this.players.forEach((player) => player.setInicialPosition(this.maze))
    }

    updatePositions() {
        let playersMin = [];

        for(let i = 0; i<this.players.length; i++) {
            let p = this.players[i];
            playersMin.push({id: p.id, x: p.x, y: p.y});
        }

        this.io.emit("positions", playersMin)
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
            this.selectedMap = 0
        }

        if(this.state === 'end') { // remove player vote on map
            for(let i=0; i<this.mapOptions.length; i++) {
                let votes = this.mapOptions[i].votes
                let j = votes.indexOf(player.id);
                if (j !== -1) {
                    votes.splice(j, 1); // remove vote from the other map
                    this.io.emit('votes', this.getVotesArray())
                    break;
                }
            }
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

    updatePoints(finishers) {

        const pointsByPos = (pos) => {
            if(pos === 1) return 10;
            if(pos === 2) return 5;
            if(pos === 3) return 3;
            return 1;
        }
        
        for(let i=0; i<finishers.length; i++) {
            finishers[i].addPoints(pointsByPos(i+1));
        }
    }

    getVotesArray() {
        let votes = []
        for(let i=0; i<this.mapOptions.length; i++) {
            let n = this.mapOptions[i].votes.length
            votes.push(n)
        }
        return votes
    }

    cleanVotes() {
        for(let i=0; i<this.mapOptions.length; i++)
            this.mapOptions[i].votes = []
    }

    processVote(id, index) {
        if(this.mapOptions[index].votes.includes(id)) return; // vote in same map as before -> nothing changes
        
        for(let i=0; i<this.mapOptions.length; i++) {
            let votes = this.mapOptions[i].votes
            let j = votes.indexOf(id);
            if (j !== -1) {
                votes.splice(j, 1); // remove vote from the other map
                break;
            }
        }

        this.mapOptions[index].votes.push(id)

        this.io.emit('votes', this.getVotesArray())
    }

    pickNextMap() {
        let votes = this.getVotesArray()

        let maior = 0;
        for(let i=0; i<votes.length; i++)
            if(votes[i] > maior)
                maior = votes[i]
        
        if(maior === 0) return; // no votes -> same map as before
        
        let opts = []
        for(let i=0; i<votes.length; i++)
            if(votes[i] === maior)
                opts.push(i)
        
        this.selectedMap = random_item(opts)

    }

    gameEnd(message) {
        console.log(message)

        this.updatePoints(this.finishers)

        this.nonFinishers = this.players.filter(element => !this.finishers.includes(element));

        this.cleanVotes()

        this.endScreenTime = Date.now()
        this.state = 'end'
        this.io.emit("gameEnd")

        setTimeout(() => {
            if(this.state === 'end') {
                this.pickNextMap()
                this.gameStart()
                this.io.emit("nextGame")
            }
        }, 10_000)
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
            this.io.emit("playerConnected", player)

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
            if(this.state === 'finishing') infoPackage.endTime = this.getEndCount() - (Date.now() - this.endStartTime)
            infoPackage.player = this.players[this.players.indexOf(player)]
            infoPackage.players = this.players;
            infoPackage.refreshDelay = this.refreshDelay;

            socket.emit("gameInfo", infoPackage)
        })

        socket.on("positionUpdate", data => {
            player.setPosition(data.x, data.y)
        })

        socket.on("getNumPlayers", () => {
            socket.emit("numPlayers", this.players.length)
        })

        socket.on("finished", () => {
            if(this.state !== 'running' && this.state !== 'finishing') return
            
            console.log("Player Finished: " + player.nickname)

            player.finishTime = Date.now() - this.startTime - startCount

            if(this.finishers.length === 0) { // first to finish

                this.state = 'finishing'
                console.log("First to finish. state = finishing")

                this.endStartTime = Date.now()
                this.io.emit("gameFinishing", this.getEndCount())

                this.timeOverTimoutId = setTimeout(() => {
                    if(this.state === 'finishing') {
                        this.gameEnd("Time over. state = end")
                    }
                }, this.getEndCount())
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
            infoPackage.nonFinishers = this.nonFinishers

            let mapOptions = []
            for(let i=0; i<this.mapOptions.length; i++) {
                let opt = this.mapOptions[i]
                mapOptions.push({width: opt.width, height: opt.height, name: opt.name})
            }
            
            infoPackage.mapOptions = mapOptions
            infoPackage.votes = this.getVotesArray()
            infoPackage.previousMap = this.selectedMap
            infoPackage.nextMatchTime = nextMatchCount - Date.now() + this.endScreenTime

            socket.emit("endInfo", infoPackage)
        })

        socket.on('vote', data => {
            if(this.state === 'end') this.processVote(player.id, data)
        })
    } 
}

module.exports = Game