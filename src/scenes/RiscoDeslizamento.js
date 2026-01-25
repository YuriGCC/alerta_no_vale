export default class RiscoDeslizamento extends Phaser.Scene {
    constructor() {
        super('RiscoDeslizamento');
        this.spawnTimer = null;
        this.score = null;
        this.scoreToWin = 10;
        this.scoreText = null;
        this.returnPos = null;
    }

    init(data) {
        this.returnPos = data;
    }

    create() {
        const {width, height} = this.scale;
        this.cameras.main.setBackgroundColor('#693f00');


        this.progressao = this.scene.get('Progressao');
        if (this.scene.isActive('Interface')) {
            this.scene.get('Interface').setAtiva(false);
        }

        this.add.text(width / 2, height * 0.1, 'Plante árvores nas rachaduras', {
            fontSize: '48px',
            fill: '#ffffffff', 
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 6
        }).setOrigin(0.5);

        this.score = 0;
        this.scoreText = this.add.text(width / 2, 100, 'Riscos Evitados: 0 / 10', { fontSize: '28px', fill: '#ffff00' }).setOrigin(0.5);

        this.iniciarGeradorDeRachaduras();
    }

    update() {

    }

    iniciarGeradorDeRachaduras() {
        this.spawnTimer = this.time.addEvent({
            delay: 500,
            callback: this.spawnRachadura,
            callbackScope: this,
            loop: true
        });
        this.spawnRachadura()
    }

    spawnRachadura() {
        const { width, height } = this.scale;
        const xPos = Phaser.Math.Between(width * 0.2, width * 0.8);
        const yPos = Phaser.Math.Between(width * 0.2, height * 0.8);
        const rachadura = this.physics.add.sprite(xPos, yPos, 'rachadura' );
        rachadura.setInteractive();

        rachadura.on('pointerdown', () => {
            this.score++;
            this.scoreText.setText(`Riscos Evitados: ${this.score} / ${this.scoreToWin}`);

            if (this.score >= this.scoreToWin) {
                this.ganharJogo();
            }
            rachadura.destroy();
        });

        rachadura.setScale(0.3)
    }

    ganharJogo() {
        this.spawnTimer.remove(); 

        this.time.delayedCall(2000, () => {
            this.sairDaCena();
        });
    }

    sairDaCena() {
        if (this.scene.isActive('Interface')) {
            this.scene.get('Interface').setAtiva(true);
        }
        this.scene.start('MundoAberto', this.returnPos);
    }
} 