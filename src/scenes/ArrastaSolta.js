export default class ArrastaSolta extends Phaser.Scene {
    constructor() {
        super('ArrastaSolta');

        this.faseAtual = 0;
        this.progression = null;
        this.returnPos = {};
        this.triggerID = '';

        this.pergunta = null;
        this.textosArrastaveis = [];
        this.zonasDeSoltar = [];
        this.botaoContinuar = null;

        // Estilos para os textos
        const baseStyle = {
            fontSize: '18px',
            fill: '#000',
            backgroundColor: '#ffffff',
            padding: { x: 10, y: 5 },
            wordWrap: { width: 280 },
            align: 'center'
        };
        this.baseStyle = baseStyle;
        this.correctStyle = { ...baseStyle, backgroundColor: '#aaffaa', fill: '#003300' };
        this.wrongStyle = { ...baseStyle, backgroundColor: '#ffaaaa', fill: '#330000' };

        // DADOS DAS 5 FASES
        this.dadosDasFases = [
            {
                id: 'gatilho_arrasta_solta_kit',
                pergunta: 'A Defesa Civil avisou que há RISCO DE ENCHENTE! O que devemos separar?',
                zona1_label: 'Levar',
                zona2_label: 'Deixar',
                respostas: [
                    { texto: 'Lanterna e Pilhas', alvo: 'zona1' },
                    { texto: 'Garrafas de Água', alvo: 'zona1' },
                    { texto: 'Videogame', alvo: 'zona2' },
                    { texto: 'Brinquedos', alvo: 'zona2' }
                ]
            },
            {
                id: 'gatilho_pe_de_vento',
                pergunta: 'Um PÉ DE VENTO forte começou! O que fazer e o que NÃO fazer?',
                zona1_label: 'É seguro fazer',
                zona2_label: 'É perigoso fazer',
                respostas: [
                    { texto: 'Ficar longe de janelas', alvo: 'zona1' },
                    { texto: 'Desligar os aparelhos da tomada', alvo: 'zona1' },
                    { texto: 'Subir no telhado para ver', alvo: 'zona2' },
                    { texto: 'Abrigar-se debaixo de árvore', alvo: 'zona2' }
                ]
            },
            {
                id: 'gatilho_risco_deslizamento',
                pergunta: 'Choveu muito. Quais são SINAIS DE PERIGO de um deslizamento?',
                zona1_label: 'Sinal de perigo',
                zona2_label: 'Seguro',
                respostas: [
                    { texto: 'Rachaduras novas na parede', alvo: 'zona1' },
                    { texto: 'Água barrenta (cor de café)', alvo: 'zona1' },
                    { texto: 'O sol aparecendo', alvo: 'zona2' },
                    { texto: 'Água limpa da torneira', alvo: 'zona2' }
                ]
            },
            {
                id: 'gatilho_sete_erros', 
                pergunta: 'Como podemos AJUDAR A PREVENIR alagamentos na nossa rua?',
                zona1_label: 'Ajuda',
                zona2_label: 'Atrapalha',
                respostas: [
                    { texto: 'Jogar lixo sempre na lixeira', alvo: 'zona1' },
                    { texto: 'Manter as calhas limpas', alvo: 'zona1' },
                    { texto: 'Jogar lixo no bueiro', alvo: 'zona2' },
                    { texto: 'Deixar entulho na calçada', alvo: 'zona2' }
                ]
            },
            {
                id: 'gatilho_risco_enchente', 
                pergunta: 'O vento acabou, mas um fio elétrico caiu na rua. O que fazer?',
                zona1_label: 'É seguro fazer',
                zona2_label: 'É perigoso fazer',
                respostas: [
                    { texto: 'Ficar bem longe do fio', alvo: 'zona1' },
                    { texto: 'Avisar um adulto imediatamente', alvo: 'zona1' },
                    { texto: 'Chegar perto para olhar', alvo: 'zona2' },
                    { texto: 'Tentar empurrar o fio com um pau', alvo: 'zona2' }
                ]
            }
        ];
    }
    
    init(data) {
        // Recebe os dados de MundoAberto e guarda
        this.returnPos = data.returnPos || {};
        this.triggerID = data.triggerID || 'arrasta_solta_default';

        // Encontra o índice da fase correspondente ao gatilho
        this.faseAtual = this.dadosDasFases.findIndex(fase => fase.id === this.triggerID);
        if (this.faseAtual === -1) {
            this.faseAtual = 0;
        }
    }

    create() {

        // Pausa a interface se estiver ativa
        if (this.scene.isActive('Interface')) {
            this.scene.get('Interface').setAtiva(false);
        }

        this.progression = this.scene.get('Progressao'); 

        this.input.dragDistanceThreshold = 0;
        this.input.topOnly = true;

        this.desenharEstrutura();
        this.carregarFase(this.faseAtual);
    }

    desenharEstrutura() {
        const { width, height } = this.scale;
        this.cameras.main.setBackgroundColor('#1d212d'); 

        const leftColumnX = width * 0.25;
        const rightColumnX = width * 0.7;
        const zoneWidth = 300;
        const zoneHeight = 150;
        
        const labelY1 = height * 0.2;  // Posição Y da primeira legenda
        const zoneY1 = labelY1 + (zoneHeight / 2) + 20; // Posição Y da primeira caixa
        
        const labelY2 = height * 0.55; // Posição Y da segunda legenda
        const zoneY2 = labelY2 + (zoneHeight / 2) + 20; // Posição Y da segunda caixa

        const itemsStartY = height * 0.3; // Onde os itens de arrastar começam
        const itemsSpacingY = 80; // Espaço entre os itens
        
        const botaoY = height * 0.9; // Posição Y do botão


        this.pergunta = this.add.text(width / 2, height * 0.08, 'Carregando...', {
            fontSize: '24px',
            fill: '#ffffff',
            align: 'center',
            wordWrap: { width: width - 40 }
        }).setOrigin(0.5);


        this.zonasDeSoltar = [];

        this.zonaCorretaLabel = this.add.text(rightColumnX, labelY1, 'CORRETO', {
            fontSize: '22px', fill: '#00ff00', fontStyle: 'bold'
        }).setOrigin(0.5);
        
        const zona1 = this.add.zone(rightColumnX, zoneY1, zoneWidth, zoneHeight)
            .setRectangleDropZone(zoneWidth, zoneHeight)
            .setData('zonaID', 'zona1');
        
        const g1 = this.add.graphics();
        g1.lineStyle(2, 0x00ff00);
        g1.strokeRect(zona1.x - zona1.input.hitArea.width / 2, zona1.y - zona1.input.hitArea.height / 2, zoneWidth, zoneHeight);
        this.zonasDeSoltar.push(zona1);

        this.zonaErradaLabel = this.add.text(rightColumnX, labelY2, 'ERRADO', {
            fontSize: '22px', fill: '#ff0000', fontStyle: 'bold'
        }).setOrigin(0.5);

        const zona2 = this.add.zone(rightColumnX, zoneY2, zoneWidth, zoneHeight)
            .setRectangleDropZone(zoneWidth, zoneHeight)
            .setData('zonaID', 'zona2');
        
        const g2 = this.add.graphics();
        g2.lineStyle(2, 0xff0000);
        g2.strokeRect(zona2.x - zona2.input.hitArea.width / 2, zona2.y - zona2.input.hitArea.height / 2, zoneWidth, zoneHeight);
        this.zonasDeSoltar.push(zona2);


        // Eventos globais de drag e drop 
        this.input.on('dragstart', (pointer, obj) => {
            obj.setData('zonaAtual', null);
            obj.setStyle(this.baseStyle);
            obj.setDepth(1); 
        });

        this.input.on('drag', (pointer, obj, dragX, dragY) => {
            obj.setPosition(dragX, dragY);
        });

        this.input.on('drop', (pointer, obj, dropZone) => {
            const zonaID = dropZone.getData('zonaID');
            obj.setData('zonaAtual', zonaID);
            
            // Posiciona o item dentro da zona
            obj.setPosition(dropZone.x, obj.y - (zoneHeight / 4) + (Math.random() * (zoneHeight / 2))); // Posição Y aleatória dentro da caixa
        });

        this.input.on('dragend', (pointer, obj, dropped) => {
            obj.setDepth(0); 
            if (!dropped) {
                obj.setPosition(obj.getData('homeX'), obj.getData('homeY'));
                obj.setData('zonaAtual', null);
            }
        });

        // Criação dos textos arrastáveis
        this.textosArrastaveis = [];
        for (let i = 0; i < 4; i++) { // Criar 4 espaços
            const textoY = itemsStartY + (itemsSpacingY * i);
            const texto = this.add.text(leftColumnX, textoY, `Texto ${i + 1}`, this.baseStyle)
                .setOrigin(0.5)
                .setInteractive()
                .setData('homeX', leftColumnX)
                .setData('homeY', textoY)
                .setData('zonaAtual', null);

            this.input.setDraggable(texto);
            this.textosArrastaveis.push(texto);
        }

        this.botaoContinuar = this.add.text(width / 2, botaoY, 'Verificar', {
            fontSize: '24px',
            backgroundColor: '#009900',
            color: '#ffffff',
            padding: { x: 15, y: 10 }
        }).setOrigin(0.5).setInteractive();

        this.botaoContinuar.on('pointerdown', () => {
            const status = this.botaoContinuar.getData('status');
            if (status === 'verificar') {
                this.validarFase();
            } else if (status === 'continuar' || status === 'finalizar') {
                this.avancarFase();
            } else if (status === 'tentar_novamente') {
                this.carregarFase(this.faseAtual); // Recarrega a fase atual
            }
        });
    }

    carregarFase(faseIndex) {
        this.faseAtual = faseIndex;
        const dados = this.dadosDasFases[faseIndex];

        if (!dados) {
            this.progression.completeMission(this.triggerID); 
            this.scene.start('MundoAberto', this.returnPos);
            return;
        }

        this.pergunta.setText(dados.pergunta);
        this.zonaCorretaLabel.setText(dados.zona1_label);
        this.zonaErradaLabel.setText(dados.zona2_label);

        this.textosArrastaveis.forEach((texto, index) => {
            const dadosResposta = dados.respostas[index];
            if (dadosResposta) {
                texto.setText(dadosResposta.texto);
                texto.setData('alvo', dadosResposta.alvo);
                texto.setPosition(texto.getData('homeX'), texto.getData('homeY'));
                texto.setStyle(this.baseStyle);
                texto.input.enabled = true;
                texto.setData('zonaAtual', null);
                texto.setVisible(true);
            } else {
                texto.setVisible(false);
            }
        });

        this.botaoContinuar.setText('Verificar');
        this.botaoContinuar.setData('status', 'verificar');
        this.botaoContinuar.setInteractive();
        this.botaoContinuar.setAlpha(1);
    }

    validarFase() {
        let todosCorretos = true;
        let totalRespostas = 0;

        this.textosArrastaveis.forEach(texto => {
            if (!texto.visible) return;

            totalRespostas++;
            const alvoID = texto.getData('alvo');
            const zonaAtualID = texto.getData('zonaAtual');
            
            if (alvoID === zonaAtualID) {
                texto.setStyle(this.correctStyle);
            } else {
                texto.setStyle(this.wrongStyle);
                todosCorretos = false;
            }
            texto.input.enabled = false; // Desativa o arrastar após verificação
        });

        if (todosCorretos && totalRespostas > 0) {

            // A missão só será salva quando todas as fases terminarem (no carregarFase)
            if (this.faseAtual === this.dadosDasFases.length - 1) {
                this.botaoContinuar.setText('Finalizar');
                this.botaoContinuar.setData('status', 'finalizar');
            } else {
                this.botaoContinuar.setText('Continuar');
                this.botaoContinuar.setData('status', 'continuar');
            }
            
        } else {
            this.botaoContinuar.setText('Tentar Novamente');
            this.botaoContinuar.setData('status', 'tentar_novamente');
        }
    }

    avancarFase() {
        // Avança para a próxima fase (ou sai se for a última)
        this.carregarFase(this.faseAtual + 1);
    }
}