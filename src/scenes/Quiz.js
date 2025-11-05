export default class Quiz extends Phaser.Scene {
    constructor() {
        super('QuizScene');
        this.returnPos = {}; // posição do jogador
    }

    init(data) {
        // Recebe os dados da posição da cena de MundoAberto e guarda
        this.returnPos = data;
    }

    create() {
        const quizData = {
            pergunta: "Durante um temporal, qual a melhor atitude?",
            opcoes: [
                { texto: "Abrigar-se debaixo de árvore.", correta: false },
                { texto: "Ficar dentro de casa e longe de janelas.", correta: true },
                { texto: "Sair para filmar a chuva.", correta: false }
            ]
        };

        const { width, height } = this.scale;
        this.cameras.main.setBackgroundColor('#1d212d');

        this.add.text(width / 2, height * 0.25, quizData.pergunta, {
            fontSize: '24px',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: width - 60 }
        }).setOrigin(0.5);

        const buttonSpacing = 80;
        const buttonYStart = height * 0.45;

        const feedbackText = this.add.text(width / 2, height * 0.8, '', {
            fontSize: '22px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5).setVisible(false);

        
        const continuarButton = this.add.text(width / 2, height * 0.9, 'Continuar', {
            fontSize: '20px',
            backgroundColor: '#009900', 
            color: '#ffffff',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setVisible(false).setInteractive();

        continuarButton.on('pointerdown', () => {
            this.scene.stop('QuizScene');
            this.scene.start('MundoAberto', this.returnPos); // retorna ao mundo ao lado do quiz
        });

        quizData.opcoes.forEach((opcao, index) => {
            const yPos = buttonYStart + (index * buttonSpacing);
            const buttonWidth = width - 100;
            const buttonHeight = 60;

            // Desenhar a caixa do botão
            const graphics = this.add.graphics();
            graphics.fillStyle(0x555555, 1); 
            graphics.fillRoundedRect((width / 2) - (buttonWidth / 2), yPos - (buttonHeight / 2), buttonWidth, buttonHeight, 16);
            
            // Texto da opção
            const optionText = this.add.text(width / 2, yPos, opcao.texto, {
                fontSize: '18px',
                color: '#ffffff',
                align: 'center',
                wordWrap: { width: buttonWidth - 20 }
            }).setOrigin(0.5);

            // Tornar a caixa clicável
            graphics.setInteractive(new Phaser.Geom.Rectangle((width / 2) - (buttonWidth / 2), yPos - (buttonHeight / 2), buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains);
            
            graphics.on('pointerdown', () => {
                this.lidarPergunta(opcao.correta, feedbackText, continuarButton, graphics);
            });
        });
    }

    lidarPergunta(ehCorreta, textoFeedback, continuarButton, graficosBotaoClicado) {
        // Desativa todos os botões para não clicar de novo

        if (ehCorreta) {
            textoFeedback.setText("Correto! É a atitude mais segura.");
            textoFeedback.setColor('#00ff00');
            graficosBotaoClicado.clear();
            graficosBotaoClicado.fillStyle(0x009900, 1);
            graficosBotaoClicado.fillRoundedRect(graficosBotaoClicado.x, graficosBotaoClicado.y, graficosBotaoClicado.width, graficosBotaoClicado.height, 16);
        } else {
            textoFeedback.setText("Errado! Tente novamente.");
            textoFeedback.setColor('#ff0000');
            graficosBotaoClicado.clear();
            graficosBotaoClicado.fillStyle(0x990000, 1); 
            graficosBotaoClicado.fillRoundedRect(graficosBotaoClicado.x, graficosBotaoClicado.y, graficosBotaoClicado.width, graficosBotaoClicado.height, 16);
        
        }

        textoFeedback.setVisible(true);
        continuarButton.setVisible(true);
    }
}