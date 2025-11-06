import PreCarregadorCenas from './scenes/PreCarregadorCenas.js';
import MundoAberto from './scenes/MundoAberto.js';
import Quiz from './scenes/Quiz.js'
import Progressao from './scenes/Progressao.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
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
    scene: [ PreCarregadorCenas, MundoAberto, Quiz, Progressao ]
}

new Phaser.Game(config);
            