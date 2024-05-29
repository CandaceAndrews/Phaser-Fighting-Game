class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        this.load.image('background', 'assets/images/background/bg.png');
        this.load.spritesheet('diablo', 'assets/images/diablo/sprites/diablo.png', { frameWidth: 1330, frameHeight: 1330 });
        this.load.spritesheet('sauron', 'assets/images/sauron/sprites/sauron.png', { frameWidth: 1330, frameHeight: 1330 });
    }

    create() {
        // Add the background image and scale it to fit the canvas
        let background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        background.displayWidth = this.sys.canvas.width;
        background.displayHeight = this.sys.canvas.height;

        // Fighter data
        const diabloData = [1330, 1, [0, 0]]; // Adjusted for simplicity
        const sauronData = [1330, 1, [0, 0]]; // Adjusted for simplicity
        const animationSteps = [5, 4, 4, 2]; // Adjust according to your sprite sheet

        // Create fighter instances
        this.diablo = new Fighter(this, 100, 300, false, diabloData, 'diablo', animationSteps);
        this.sauron = new Fighter(this, 700, 300, true, sauronData, 'sauron', animationSteps);

        // Initialize custom keys for actions
        this.keys = this.input.keyboard.addKeys({
            A: Phaser.Input.Keyboard.KeyCodes.A,
            D: Phaser.Input.Keyboard.KeyCodes.D,
            W: Phaser.Input.Keyboard.KeyCodes.W,
            R: Phaser.Input.Keyboard.KeyCodes.R,
            T: Phaser.Input.Keyboard.KeyCodes.T
        });
    }

    update() {
        // Update fighters
        this.diablo.move(this.keys, this.sauron);
        this.sauron.move(this.keys, this.diablo);

        // Call update on fighters
        this.diablo.update();
        this.sauron.update();
    }
}

const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 600,
    backgroundColor: '#000000',
    scene: MainScene,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    }
};

const game = new Phaser.Game(config);

