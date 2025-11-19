export default class PeDeVento extends Phaser.Scene {
    constructor() {
        super('PeDeVento');

        this.janelas = [];
        this.maxErros = 3;
        this.errosAtuais = 0;
        
        this.gameTimer = null;
        this.eventTimer = null;
        
        this.progression = null;
        this.returnPos = {};
    }

    init(data) {
        // Recebe a posição de retorno do MundoAberto
        this.returnPos = data;
    }

    create() {
        this.progression = this.scene.get('Progressao');

        if (this.scene.isActive('Interface')) {
            this.scene.get('Interface').setAtiva(false); 
        }

        this.add.image(400, 300, 'fundo_sala');

        // Posições das janelas
        const posicoes = [
            { x: 150, y: 300 },
            { x: 400, y: 300 },
            { x: 650, y: 300 }
        ];

        this.janelas = [];
        this.errosAtuais = 0;

        // 2. Criar as Janelas
        posicoes.forEach((pos, index) => {
            const janela = this.add.sprite(pos.x, pos.y, 'janela_fechada')
                .setInteractive()
                .setData('isOpen', false)
                .setData('id', index);
            
            janela.on('pointerdown', () => this.clicarJanela(janela));
            
            this.janelas.push(janela);
        });

        this.add.text(400, 50, 'Pé de Vento Chegando!', { fontSize: '32px', fill: '#ff0000', fontStyle: 'bold' }).setOrigin(0.5);
        this.add.text(400, 90, 'Clique nas janelas que o vento abrir para fechá-las!', { fontSize: '20px', fill: '#ffffff' }).setOrigin(0.5);
        
        this.timerText = this.add.text(400, 550, 'Tempo Restante: 30', { fontSize: '24px', fill: '#ffff00' }).setOrigin(0.5);
        this.errorText = this.add.text(400, 500, 'Janelas abertas: 0 / 3', { fontSize: '24px', fill: '#ff0000' }).setOrigin(0.5);
        
        // Timers do Jogo
        // Timer principal de 30 segundos para vencer
        this.gameTimer = this.time.addEvent({
            delay: 30000,
            callback: this.ganharJogo,
            callbackScope: this,
            loop: false
        });

        // Timer que chama o evento de abrir janela
        this.eventTimer = this.time.addEvent({
            delay: 2000, 
            callback: this.abrirJanelaAleatoria,
            callbackScope: this,
            loop: true
        });
    }

    update() {
        // Atualiza o texto do timer
        if (this.gameTimer) {
            const tempoRestante = Math.ceil(this.gameTimer.getRemainingSeconds());
            this.timerText.setText(`Tempo Restante: ${tempoRestante}`);
        }
    }

    abrirJanelaAleatoria() {
        // Filtra apenas as janelas que estão fechadas
        const janelasFechadas = this.janelas.filter(j => !j.getData('isOpen'));

        if (janelasFechadas.length > 0) {
            // Escolhe uma janela aleatória das fechadas
            const janela = Phaser.Utils.Array.GetRandom(janelasFechadas);
            
            janela.setTexture('janela_aberta');
            janela.setData('isOpen', true);
            
            this.errosAtuais++;
            this.atualizarTextoErro();

            // Se o jogador não fechar a tempo perde
            if (this.errosAtuais >= this.maxErros) {
                this.perderJogo();
            }
        }
    }

    clicarJanela(janela) {
        // Só faz algo se a janela clicada estiver aberta
        if (janela.getData('isOpen')) {            
            janela.setTexture('janela_fechada');
            janela.setData('isOpen', false);
            
            this.errosAtuais--;
            this.atualizarTextoErro();
        }
    }

    atualizarTextoErro() {
        this.errorText.setText(`Janelas abertas: ${this.errosAtuais} / ${this.maxErros}`);
    }

    pararTimers() {
        if (this.gameTimer) this.gameTimer.destroy();
        if (this.eventTimer) this.eventTimer.destroy();
        this.gameTimer = null;
        this.eventTimer = null;
    }

    ganharJogo() {
        this.pararTimers();
        this.janelas.forEach(j => j.disableInteractive());
        
        this.add.text(400, 300, 'VOCÊ VENCEU!', { fontSize: '40px', fill: '#00ff00', fontStyle: 'bold' }).setOrigin(0.5);

        this.progression.missaoCompleta('gatilho_pe_de_vento');
        
        // Botão para sair
        this.time.delayedCall(2000, () => {
            this.add.text(400, 400, 'Clique para Continuar', { fontSize: '24px', fill: '#ffffff' })
                .setOrigin(0.5)
                .setInteractive()
                .on('pointerdown', () => this.sairDaCena());
        });
    }

    perderJogo() {
        this.pararTimers();
        this.janelas.forEach(j => j.disableInteractive());

        this.add.text(400, 300, 'NÃO FOI DESTA VEZ!', { fontSize: '40px', fill: '#ff0000', fontStyle: 'bold' }).setOrigin(0.5);

        // Botão para tentar de novo
        this.time.delayedCall(2000, () => {
            this.add.text(400, 400, 'Tentar Novamente', { fontSize: '24px', fill: '#ffffff' })
                .setOrigin(0.5)
                .setInteractive()
                .on('pointerdown', () => this.scene.restart(this.returnPos)); // Reinicia a cena
        });
    }

    sairDaCena() {
        if (this.scene.isActive('Interface')) {
            this.scene.get('Interface').setAtiva(true);
        }
        this.scene.start('MundoAberto', this.returnPos);
    }
}