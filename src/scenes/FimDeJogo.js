export default class FimDeJogo extends Phaser.Scene {
    constructor() {
        super('FimDeJogo');
    }

    create() {
        const { width, height } = this.scale;
        this.cameras.main.setBackgroundColor('#1d212d');

        // Esconde o HUD se estiver ativo
        if (this.scene.isActive('Interface')) {
            this.scene.get('Interface').setAtiva(false);
        }

        // Pega a pontuação final
        const progresso = this.scene.get('ProgressionScene');
        const totalMedalhas = progresso ? progresso.getScore() : 0;

        // --- Título ---
        this.add.text(width / 2, height * 0.1, 'PARABÉNS!', {
            fontSize: '48px',
            fill: '#ffd700', 
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // --- Mensagem ---
        this.add.text(width / 2, height * 0.2, 'Você completou o treino da Defesa Civil.', {
            fontSize: '24px',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        // --- O Certificado (Gráfico) ---
        const certWidth = 600;
        const certHeight = 300;
        const certY = height * 0.5;

        // Fundo do certificado (papel)
        const graphics = this.add.graphics();
        graphics.fillStyle(0xfffdd0, 1); 
        graphics.fillRoundedRect((width - certWidth) / 2, certY - (certHeight / 2), certWidth, certHeight, 20);
        
        // Borda do certificado
        graphics.lineStyle(8, 0xdaa520, 1); 
        graphics.strokeRoundedRect((width - certWidth) / 2, certY - (certHeight / 2), certWidth, certHeight, 20);

        // Texto do Certificado
        this.add.text(width / 2, certY - 80, 'CERTIFICADO', {
            fontSize: '36px', fill: '#000', fontStyle: 'bold', fontFamily: 'serif'
        }).setOrigin(0.5);

        this.add.text(width / 2, certY, 'Conferido ao Jogador', {
            fontSize: '20px', fill: '#333', fontFamily: 'serif'
        }).setOrigin(0.5);

        this.add.text(width / 2, certY + 40, 'AMIGO DA VIZINHANÇA', {
            fontSize: '32px', fill: '#0044aa', fontStyle: 'bold'
        }).setOrigin(0.5);

        // --- Selo de Medalhas ---
        this.add.image(width / 2 + 220, certY + 80, 'medalha').setScale(0.5);
        this.add.text(width / 2 + 225, certY + 72, totalMedalhas.toString(), {
            fontSize: '24px', fill: '#fff', stroke: '#000', strokeThickness: 4
        }).setOrigin(0.5);


        // --- Botão Reiniciar ---
        const btnReiniciar = this.add.text(width / 2, height * 0.85, 'Jogar Novamente', {
            fontSize: '28px',
            backgroundColor: '#009900',
            color: '#ffffff',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        btnReiniciar.on('pointerdown', () => {
            // Reinicia o jogo (recarrega a página é a forma mais limpa de limpar tudo)
            window.location.reload();
        });
    }
}