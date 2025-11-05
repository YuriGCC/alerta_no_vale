import PreCarregadorCenas from './scenes/PreCarregadorCenas.js';
import MundoAberto from './scenes/MundoAberto.js';


const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    render: {
        pixelArt: true
    },
    scene: [ PreCarregadorCenas, MundoAberto ]
}

new Phaser.Game(config);
            