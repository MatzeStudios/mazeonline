
class Player {
    constructor(id) {
        this.x = 0
        this.y = 0
        this.vx = 0
        this.vy = 0
        this.running = false
        this.id = id
        this.nickname = "Unnamed"
    }

    setInicialPosition(maze) {
        this.x = maze.sx + .5
        this.y = maze.sy + .5
    }

    setPosition(x, y) {
        this.x = x
        this.y = y
    }

    setVelocity(vx, vy, running) {
        this.vx = vx
        this.vy = vy
        this.running = running
    }
}

module.exports = Player