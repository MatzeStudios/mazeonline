
class Player {
    constructor(id) {
        this.x = 0
        this.y = 0
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
}

module.exports = Player