/*
   Esta cena corre em paralelo com o jogo.
   A sua única função é guardar o estado e o progresso do jogador,
   para que as outras cenas reagirem como desejarem aos marcos dentro do jogo
*/
export default class Progressao extends Phaser.Scene {
    constructor() { 
        super('Progressao');

        this.missoesCompletas = {};
    }

    missaoCompleta(idMissao) {
        this.missoesCompletas[idMissao] = true;
    }

    missaoFoiConcluida(idMissao) {
        // Retorna true se a missão existir no objeto, ou false se não existir
        return this.missoesCompletas[idMissao] || false;
    }
}