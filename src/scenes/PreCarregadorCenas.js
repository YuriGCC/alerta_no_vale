export default class PreCarregadorCenas extends Phaser.Scene {
    constructor() {
        super('PreCarregadorCenas');
    }

    preload() {
        this.add.text(20, 20, 'Carregando...');

        this.load.image('mapa', 'assets/map/tiles.png');
        this.load.image('medalha', 'assets/medalha.png')

        this.load.tilemapTiledJSON('mapaJSON', 'assets/map/mapa.json');

        this.load.spritesheet('amora', 'assets/characters/dog.png', { 
            frameWidth: 64, 
            frameHeight: 61 
        });


        // Gráficos cena pé de vendo
        let graphics = this.make.graphics();
        graphics.fillStyle(0x8B4513, 1.0); 
        graphics.fillRect(0, 0, 800, 600);
        graphics.generateTexture('fundo_sala', 800, 600);
        
        graphics.fillStyle(0xADD8E6, 1.0); 
        graphics.fillRect(0, 0, 100, 150);
        graphics.lineStyle(5, 0xffffff); 
        graphics.lineBetween(50, 0, 50, 150);
        graphics.lineBetween(0, 75, 100, 75);
        graphics.generateTexture('janela_fechada', 100, 150);
        
        graphics.fillStyle(0xFFFFFF, 1.0);
        graphics.fillRect(0, 0, 100, 150);
        graphics.generateTexture('janela_aberta', 100, 150);

        graphics.destroy();

        this.load.spritesheet('lixeiras', 'assets/tipos_lixeira.png', {
            frameWidth: 32,
            frameHeight: 64
        });

        this.load.image('lixo_atlas', 'assets/tipos_lixo.jpg');
    }   

    create() {
        // inicia a cena e a mantém rodando de fundo
        this.scene.launch('Progressao');

        // Inicia a cena principal do jogo
        this.scene.start('MundoAberto');
    }
}