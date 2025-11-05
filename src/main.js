import PreCarregadorCenas from './scenes/PreCarregadorCenas.js';
import MundoAberto from './scenes/MundoAberto.js';
import Quiz from './scenes/Quiz.js'


const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    render: {
        pixelArt: true
    },
    scene: [ PreCarregadorCenas, MundoAberto, Quiz ]
}

new Phaser.Game(config);
            