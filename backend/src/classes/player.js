
class Player {
    constructor(id) {
        this.x = 0;
        this.y = 0;
        this.id = id;
        this.color = "#FFFFFF";
        this.nickname = "Unnamed";
        this.nSides = 3;
        this.points = 0;
        this.finishTime = -1;
    }

    setInicialPosition(maze) {
        this.x = maze.sx + .5;
        this.y = maze.sy + .5;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    setNickname(nickname) {
        this.nickname = nickname.trim() == '' ? 'Unnamed' : nickname.trim();
    }

    setColor(color) {
        this.color = color;
    }

    addPoints(quant) {
        this.pointChange = quant;
        this.points += quant;
        this.nSides = 3 + Math.floor(this.points/10)
    }
}

module.exports = Player