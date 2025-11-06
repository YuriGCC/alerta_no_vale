import PreCarregadorCenas from './scenes/PreCarregadorCenas.js';
import MundoAberto from './scenes/MundoAberto.js';
import Quiz from './scenes/Quiz.js'
import Progressao from './scenes/Progressao.js';
import ArrastaSolta from './scenes/ArrastaSolta.js';
import PeDeVento from './scenes/PeDeVento.js';
import RiscoDeslizamento from './scenes/RiscoDeslizamento.js';
import RiscoEnchente from './scenes/RiscoEnchente.js';
import SepararLixo from './scenes/SepararLixo.js';
import SeteErros from './scenes/SeteErros.js';
import Interface from './scenes/Interface.js';

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
        pixelArt: true,
        roundPixels: true,
    },
    scene: [ 
        PreCarregadorCenas, MundoAberto, Quiz, Progressao,
        ArrastaSolta, PeDeVento, RiscoDeslizamento, RiscoEnchente,
        SepararLixo, SeteErros, Interface
    ]
}

new Phaser.Game(config);
            