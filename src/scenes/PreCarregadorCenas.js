export default class PreCarregadorCenas extends Phaser.Scene {
    constructor() {
        super('PreCarregadorCenas');
    }

    preload() {
        this.add.text(20, 20, 'Carregando...');

        this.load.image('mapa', 'assets/map/tiles.png');
        
        this.load.tilemapTiledJSON('mapaJSON', 'assets/map/mapa.json');

        this.load.spritesheet('amora', 'assets/characters/dog.png', { 
            frameWidth: 64, 
            frameHeight: 61 
        });
    }

    create() {
        // Inicia a próxima cena
        this.scene.start('MundoAberto');
    }
}