/*
   Esta cena corre em paralelo com o jogo.
   A sua única função é guardar o estado e o progresso do jogador,
   para que as outras cenas reagirem como desejarem aos marcos dentro do jogo
*/
export default class Progressao extends Phaser.Scene {
    constructor() { 
        super('Progressao');

        this.missoesCompletas = {};
        this.medalhas = 0;
        this.missoesLixoCompletas = 0;
        this.totalMissoesLixo = 5;
    }

    missaoCompleta(idMissao) {
        if (this.missaoFoiConcluida(idMissao)) {
            return;
        }


        this.missoesCompletas[idMissao] = true;

        // Lógica para concluir as cenas de lixo
        if (idMissao.startsWith('gatilho_separar_lixo_')) {
            this.missoesLixoCompletas++;
            
            // Verifica se o jogador completou todas as missoes de lixo
            if (this.missoesLixoCompletas >= this.totalMissoesLixo) {
                this.adicionarMedalha();
                this.missoesCompletas['missao_lixo_completa'] = true; 
            }
        } else {
            // Lógica para o restante das missões
            this.adicionarMedalha();
        }
    }

    missaoFoiConcluida(idMissao) {
        // Retorna true se a missão existir no objeto, ou false se não existir
        return this.missoesCompletas[idMissao] || false;
    }

    adicionarMedalha() {
        this.medalhas += 1;
        this.events.emit('NovaMedalhaObtida', this.medalhas)
    }

    obterMedalhas() {
        return this.medalhas;
    }
}