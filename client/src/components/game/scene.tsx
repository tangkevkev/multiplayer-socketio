export default class Scene extends Phaser.Scene {
    private helloWorld: Phaser.GameObjects.Text = null as any;

    constructor() {
        super({
            key: 'Game'
        });


    }

    create() {
        this.helloWorld = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            "Hello World", {
            font: "40px Arial",
        }
        );
        this.helloWorld.setOrigin(0.5);
    }

    init() {
        this.cameras.main.setBackgroundColor('#24252A')
    }
    update() {
        this.helloWorld.angle += 1;
    }
}
