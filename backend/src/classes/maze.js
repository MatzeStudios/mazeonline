
const N = 1
const E = 2
const W = 4
const S = 8

const dx = (a) => a == N || a == S ? 0 : (a == E ? 1 : -1);
const dy = (a) => a == E || a == W ? 0 : (a == S ? 1 : -1);
const opposite = (a) => {
    if (a == N) return S;
    if (a == E) return W;
    if (a == W) return E;
    // a == S 
    return N;
}

const shuffle = (array) => {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
}

const random_item = (items) => items[Math.floor(Math.random()*items.length)];

const get_random_integer = (min, max) => Math.floor(Math.random() * (max - min)) + Math.floor(min);

class Maze {
    constructor(width, height, n_paths=1) {
        this.width = width;
        this.height = height;
        this.n_paths = n_paths;

        this.grid = [];

        for (var i = 0; i < height; i++) {
            let line = [];
            for (var j = 0; j < width; j++) {
                line.push(0);
            }
            this.grid.push(line);
        } // Initializes the grid with zeros.

        this.carve_passages();
        this.choose_endpoints();
        this.more_paths(this.sx,this.sy,this.ex,this.ey,n_paths-1);
    }

    carve_passages_from(cx, cy) {
        // Recursive function used to generate the maze.
        let dirs = [N, E, W, S];
        shuffle(dirs);

        dirs.forEach(dir => {
            let nx = cx + dx(dir);
            let ny = cy + dy(dir);

            if(nx >= 0 && ny >= 0 && nx < this.width && ny < this.height && this.grid[ny][nx] == 0) {
                this.grid[cy][cx] |= dir;
                this.grid[ny][nx] |= opposite(dir);
                this.carve_passages_from(nx, ny)
            }
        });
    }

    carve_passages() {
        // Set the grid matrix by generating a random perfect maze
        this.carve_passages_from(get_random_integer(0,this.width), get_random_integer(0,this.height));
    }

    recursive_dist_to(cx, cy, cdist, dist_matrix) {
        dist_matrix[cy][cx] = cdist;
        
        let dirs = [N, E, W, S];

        dirs.forEach(dir => {
            if((this.grid[cy][cx] & dir) != 0) {
                let nx = cx + dx(dir);
                let ny = cy + dy(dir);
    
                if(nx >= 0 && ny >= 0 && nx < this.width && ny < this.height && dist_matrix[ny][nx] == -1) {
                    this.recursive_dist_to(nx, ny, cdist+1, dist_matrix);
                }
            }
        });
    }

    distance_to(cx, cy) {
        // Calculate the distance from a cell (cx, cy) to every other cell in the maze, returns a matrix of distances.
        // The maze needs to be perfect when this function is called, otherwise it runs forever.
        const dist_matrix = []

        for (var i = 0; i < this.height; i++) {
            let line = [];
            for (var j = 0; j < this.width; j++) {
                line.push(-1);
            }
            dist_matrix.push(line);
        }

        this.recursive_dist_to(cx, cy, 0, dist_matrix);
        return dist_matrix;
    }

    more_paths(xi, yi, xf, yf, n_new_paths) {
        // Creates (n_new_paths) new paths from (xi,yi) to (xf,yf). In a perfect maze there is only
        // one path between this cells, whatever they are. The maze needs to be perfect for this
        // function to work, since it calls distance_to. The function does not create paths that are
        // less than 0.7 times the main path distance, if it has been calculated.

        const dists_i = this.distance_to(xi, yi)
        const dists_f = this.distance_to(xf, yf)

        // 1 and 0 matrix, for each cell, if its closer to (xi,yi) or closer to (xf,yf). 
        const groups = []
        for (var y = 0; y < this.height; y++) {
            let line = [];
            for (var x = 0; x < this.width; x++) {
                line.push( (dists_i[y][x] > dists_f[y][x]) ? 1 : 0);
            }
            groups.push(line);
        }

        // changes to 2 the zeros that have a frontier with the ones.
        // and if there is no direct path from the 0 to the 1.
        let dirs = [N, E, W, S];

        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                if(groups[y][x]) continue;

                dirs.forEach(dir => {
                    let nx = x + dx(dir);
                    let ny = y + dy(dir);
        
                    if(nx >= 0 && ny >= 0 && nx < this.width && ny < this.height
                                                            && groups[ny][nx] == 1 && (this.grid[y][x] & dir) == 0) {
                        groups[y][x] = 2;
                    }
                });
            }
        }

        // saves the coordinates of the twos, the border.
        const border = [];

        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                if(groups[y][x] == 2) border.push([x,y]);
            }
        }

        shuffle(border);

        for(var i = 0; i < n_new_paths; i++) {
            if(i >= border.length) break; // Não tem mais bordas -> vai embora sem criar (n_new_paths).

            let px = border[i][0]
            let py = border[i][1]

            let over = false;
            dirs.forEach(dir => {
                if(!over) {
                    let nx = px + dx(dir);
                    let ny = py + dy(dir);
        
                    if(nx >= 0 && ny >= 0 && nx < this.width && ny < this.height
                                                                && groups[ny][nx] == 1 && (this.grid[py][px] & dir) == 0) {
                        
                        if(this.main_path_length == undefined ||
                            dists_i[py][px] + dists_f[ny][nx] > Math.floor(this.main_path_length * 0.7)) {
                            // não remove se a remoção criar um caminho muito pequeno
                            this.grid[py][px] |= dir;
                            this.grid[ny][nx] |= opposite(dir);
                            over = true;

                            console.log(`Borda removida: dividia (${px},${py}) e (${nx},${ny}). Distancia até o inicio: ${dists_i[py][px]}. Distancia até o final: ${dists_f[ny][nx]}. Total = ${dists_i[py][px] + dists_f[ny][nx]}`);
                        }
                    }
                }
            });

            // se over ainda é false, não removeu pois o caminho ficaria pequeno
            if(!over) n_new_paths++;
        }
    }

    choose_endpoints() {
        // choose the start and end points of the maze, making sure that they are dead-ends and maximazing the distance.

        const possible = []
        
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                let aux = this.grid[y][x];
                if(aux == N || aux == E || aux == W || aux == S) possible.push([x,y])
            }
        }

        let start = random_item(possible)
        this.sx = start[0]
        this.sy = start[1]

        const dists = this.distance_to(this.sx, this.sy)

        let maiorDist = 0;
        let mx = this.sx;
        let my = this.sy;

        for(var i = 0; i < possible.length; i++) {
            let x = possible[i][0];
            let y = possible[i][1];
            if(dists[y][x] > maiorDist) {
                maiorDist = dists[y][x];
                mx = x;
                my = y;
            }
        }

        this.ex = mx;
        this.ey = my;

        this.main_path_length = maiorDist;
    }

    printConsole() {
        // prints the maze and some info in the console.

        let str = "";

        str += " " + "_".repeat(this.width * 2 - 1) + "\n";

        for(var y = 0; y < this.height; y++) {
            str += "|";
            for(var x = 0; x < this.width; x++) {
                str += ((this.grid[y][x] & S) != 0) ? " " : "_";
                if((this.grid[y][x] & E) != 0)
                    str += (((this.grid[y][x] | this.grid[y][x+1]) & S) != 0) ? " " : "_";
                else
                    str += "|";
            }
            str += "\n";
        }
        console.log(str)

        if(this.sx != undefined && this.sy != undefined && this.ex != undefined && this.ey != undefined) {
            console.log(`Start = (${this.sx}, ${this.sy}); End = (${this.ex}, ${this.ey}). Tamanho do caminho principal: ${this.main_path_length}`)
        }
    }

    verifyMovement(xi, yi, xf, yf, radius) {    // ISN'T USED IN THE CLIENT, CAUSE IT ISN'T SENT WITH SOCKETIO
                                                // THIS FUNCTION IS COPIED THERE.
        let xiI = Math.floor(xi)
        let yiI = Math.floor(yi)
        let xfI = Math.floor(xf)
        let yfI = Math.floor(yf)

        if(xiI == xfI && yiI == yfI) { // não muda de célula
            return [xf,yf]
        }

        // muda de célula

        if(xiI != xfI && yiI != yfI) { // tentando mudar de célula na diagonal
            if(xfI > xiI  && (this.grid[yiI][xiI] & E) != 0)
                return [xf,yi]
                
            if(xfI < xiI  && (this.grid[yiI][xiI] & W) != 0)
                return [xf,yi]
                
            if(yfI > yiI  && (this.grid[yiI][xiI] & S) != 0)
                return [xi,yf]
                
            if(yfI < yiI  && (this.grid[yiI][xiI] & N) != 0)
                return [xi,yf]
            
            return [xi,yi]
        }

        if(xfI > xiI)
            return (this.grid[yiI][xiI] & E) != 0 ? [xf,yf] : [xi,yf] // -> realiza somente o movimento que não é na direção
                                                                      // da parede, se ela existir, e o movimento completo
                                                                      // se ela existir
            
        if(xfI < xiI)
            return (this.grid[yiI][xiI] & W) != 0 ? [xf,yf] : [xi,yf]
        
        if(yfI > yiI)
            return (this.grid[yiI][xiI] & S) != 0 ? [xf,yf] : [xf,yi]
            
        if(yfI < yiI)
            return (this.grid[yiI][xiI] & N) != 0 ? [xf,yf] : [xf,yi]
    }
}

module.exports = Maze