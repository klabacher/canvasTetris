const Tetris = {
    "settings": {
        "fps": 3,
        "rows": 20,
        "columns": 10,
        "speed": 500,
        "colors": {
            "cyan": "#00ffff",
            "blue": "#0000ff",
            "orange": "#ffa500",
            "yellow": "#ffff00",
            "green": "#00ff00",
            "purple": "#800080",
            "red": "#ff0000"
        },
        "blockheightP": 25,
        "blockwidthP": 25
    },
    "blocks": [
        {
            "name": "I",
            "shape": [
                [1, 1, 1, 1]
            ],
            "color": "cyan"
        },
        {
            "name": "J",
            "shape": [
                [1, 0, 0],
                [1, 1, 1]
            ],
            "color": "blue"
        },
        {
            "name": "L",
            "shape": [
                [0, 0, 1],
                [1, 1, 1]
            ],
            "color": "orange"
        },
        {
            "name": "O",
            "shape": [
                [1, 1],
                [1, 1]
            ],
            "color": "yellow"
        },
        {
            "name": "S",
            "shape": [
                [0, 1, 1],
                [1, 1, 0]
            ],
            "color": "green"
        },
        {
            "name": "T",
            "shape": [
                [0, 1, 0],
                [1, 1, 1]
            ],
            "color": "purple"
        },
        {
            "name": "Z",
            "shape": [
                [1, 1, 0],
                [0, 1, 1]
            ],
            "color": "red"
        }
    ]
}



class Texture {
    constructor() { this.textures = Tetris }
    DrawTexture(block, x, y) {
        this.ctx.fillStyle = block.color;
        this.ctx.fillRect(x, y, this.textures.settings.blockwidthP, this.textures.settings.blockheightP);

        this.ctx.strokeStyle = "#000";
        this.ctx.strokeRect(x, y, this.textures.settings.blockwidthP, this.textures.settings.blockheightP);
    }
}

class Graphics extends Texture {
    constructor(game) {
        super(game);
        this.GameCanvas = document.getElementById("GameCanvas");
        this.ctx = GameCanvas.getContext("2d");
        this.setupLoop();
    }

    

    setupLoop() {
        setInterval(() => {
            this.setupCanvas();
            this.setupLines();
            this.drawnBlocks();
        }, 500 / this.textures.settings.fps);
    }

    drawnBlocks() {
        for (var i = 0; i < this.textures.settings.rows; i++) {
            for (var j = 0; j < this.textures.settings.columns; j++) {
                if (this.mapGame[i][j] != 0) {
                    this.DrawTexture(this.mapGame[i][j], j * this.textures.settings.blockwidthP, i * this.textures.settings.blockheightP)
                }
            }
        }
    }
    setupLines() {
        for (var i = 0; i < this.textures.settings.rows; i++) {
            this.ctx.moveTo(0, i * this.textures.settings.blockheightP);
            this.ctx.lineTo(this.textures.settings.columns * this.textures.settings.blockwidthP, i * this.textures.settings.blockheightP);
            this.ctx.stroke();
        }
        for (var i = 1; i < this.textures.settings.columns; i++) {
            this.ctx.moveTo(i * this.textures.settings.blockwidthP, 0);
            this.ctx.lineTo(i * this.textures.settings.blockwidthP, this.textures.settings.rows * this.textures.settings.blockheightP);
            this.ctx.stroke();
        }
    }
    setupCanvas() {
        this.GameCanvas.width = this.textures.settings.columns * this.textures.settings.blockwidthP;
        this.GameCanvas.height = this.textures.settings.rows * this.textures.settings.blockheightP;

        this.ctx.fillStyle = "#fff";
        this.ctx.fillRect(0, 0, this.GameCanvas.width, this.GameCanvas.height);
    }
}

class Colision {
    constructor() {
        this.blocks = Tetris.blocks;
        this.settings = Tetris.settings;
    }

    checkColision(type) {
        // Check if block is out of bonds or collides with another block based on Tetris shape
        console.log(this.controlBlocks)
        if (this.controlBlocks.length != 0) {
            var response = this.controlBlocks.map((block) => {
                var x = block[0]; var y = block[1];
                switch (type) {
                    case 'right':
                        y++;
                        if (x > 19 || x < 0 || y > 9 || y < 0) {
                            return false;
                        } else {
                            return true;
                        }
                    case 'left':
                        y--;
                        if (x > 19 || x < 0 || y > 9 || y < 0) {
                            return false;
                        } else {
                            return true;
                        }
                    case 'down':
                        x++;
                        if (x > 19 || x < 0 || y > 9 || y < 0) {
                            return false;
                        } else {
                            return true;
                        }
                }
            });
            if (response.includes(false)) {
                return false;
            } else {
                return true;
            }
        }
    }
}

class GameObject extends Colision {
    constructor(x, y, block, game) {
        super();
        this.x = x; this.y = y; this.previousX; this.previousY; this.block = block; this.game = game;
        this.CreateBlock();
    }

    CreateBlock() {
        // Create a block
        this.controlBlocks = this.game.setmapGame(this.x, this.y, this.block);
        // this.checkColision(); On spawn fail colision game
        this.setupKeyboard();
    }

    moveBlock(code) {
        switch (code) {
            case "ArrowLeft":
                this.previousY = this.y;
                this.previousX = this.x;
                if (this.checkColision("left")) {
                    this.y--;
                    break
                } else {
                    console.log("colision")
                }
            case "ArrowUp":
                this._rotate();
                break;
            case "ArrowRight":
                this.previousY = this.y;
                this.previousX = this.x;
                if (this.checkColision("right")) {
                    this.y++;
                    break
                } else {
                    console.log("colision")
                }
            case "ArrowDown":
                this.previousY = this.y;
                this.previousX = this.x;
                if (this.checkColision("down")) {
                    this.x++;
                    break
                } else {
                    console.log("colision")
                }
        }
        this.game.setmapGame(this.previousX, this.previousY);
        this.controlBlocks = this.game.setmapGame(this.x, this.y, this.block);
    }

    setupKeyboard() {
        window.addEventListener("keydown", function (e) {
            this.moveBlock(e.code)
        }.bind(this));
    }

    _rotate() {
        // Rotate block
    }

    loop() {
        // Move block down and check colision
        this.x++;
        this.checkColision();
    }
    kill() {}
}

class Game extends Graphics {
    constructor() {
        super();
        this.mapGame = [];
        this.setupMapGame();
        this.actualblock = new GameObject(1, 4, 3, this);
    }

    setmapGame(x, y, block) {
        if (!block) {
            // TODO delete entire block
            block = this.mapGame[x][y];
            for (var i = 0; i < block.shape.length; i++) {
                for (var j = 0; j < block.shape[i].length; j++) {
                    if (block.shape[i][j] == 1) {
                        this.mapGame[x + i][y + j] = 0;
                    }
                }
            }
        } else {
            var controlBlocks = [];
            for (var i = 0; i < Tetris.blocks[block].shape.length; i++) {
                for (var j = 0; j < Tetris.blocks[block].shape[i].length; j++) {
                    if (Tetris.blocks[block].shape[i][j] == 1) {
                        this.mapGame[x + i][y + j] = Tetris.blocks[block];
                        controlBlocks.push([x + i, y + j]);
                    }
                }
            }
            return controlBlocks
        }
    }

    setupMapGame() {
        for (var i = 0; i < this.textures.settings.rows; i++) {
            this.mapGame[i] = [];
            for (var j = 0; j < this.textures.settings.columns; j++) {
                this.mapGame[i][j] = 0;
            }
        }
    }
}

window.onload = () => {
    var game = new Game();
};