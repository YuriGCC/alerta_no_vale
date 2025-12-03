export default class SepararLixo extends Phaser.Scene {
    constructor() {
        super('SepararLixo');

        // Configuração central: Liga o TIPO -> LIXEIRA -> ITEM
        // Estou assumindo as cores padrões da coleta seletiva (Brasil):
        // Papel = Azul, Plástico = Vermelho, Vidro = Verde.
        // Nota: Geralmente Amarelo é Metal e Marrom é Orgânico. 
        // Como você tem "lixeira_amarela" e "organico.png", liguei os dois para o jogo funcionar.
        this.configLixo = {
            'papel': { 
                binImg: 'lixeira_azul', 
                itemImg: 'papel' 
            },
            'plastico': { 
                binImg: 'lixeira_vermelha', 
                itemImg: 'plastico' 
            },
            'vidro': { 
                binImg: 'lixeira_verde', 
                itemImg: 'vidro' 
            },
            'organico': { 
                binImg: 'lixeira_amarela', 
                itemImg: 'organico' 
            }
        };

        this.returnPos = {};
        this.progressao = null;
        this.triggerID = '';

        this.score = 0;
        this.scoreToWin = 5; 
        this.scoreText = null;
        this.spawnTimer = null;
    }
    
    init(data) {
        this.returnPos = data.returnPos || {};
        this.triggerID = data.triggerID || 'gatilho_separar_lixo_1';
    } 

    create() {
        const { width, height } = this.scale;
        this.cameras.main.setBackgroundColor('#333333');
    
        this.progressao = this.scene.get('Progressao');
        if (this.scene.isActive('Interface')) {
            this.scene.get('Interface').setAtiva(false);
        }
        
        this.score = 0;
    
        // Criar as Lixeiras e Legendas ---
        const yPos = height * 0.85; 
        const chaves = Object.keys(this.configLixo); 
        const totalLixeiras = chaves.length;
    
        chaves.forEach((tipo, index) => {
            const config = this.configLixo[tipo];
            
            // Calcula posição X
            const espacamento = width / (totalLixeiras + 1);
            const xPos = espacamento * (index + 1);
            
            // Cria a imagem da lixeira
            const lixeira = this.physics.add.image(xPos, yPos, config.binImg)
                .setData('tipo_lixo_correto', tipo)
                .setImmovable(true);
    
            lixeira.setScale(0.5); 
            lixeira.setInteractive();
            lixeira.input.dropZone = true;
    
            // Legenda embaixo da lixeira
            // Pega o nome do tipo (ex: 'papel') e transforma em maiúsculo ('PAPEL')
            const textoLegenda = tipo.toUpperCase();
    
            this.add.text(xPos, yPos + 60, textoLegenda, { 
                fontSize: '18px', 
                fill: '#ffffff',
                fontStyle: 'bold',
                stroke: '#000000',   
                strokeThickness: 3
            }).setOrigin(0.5);         
        });
    
        // --- Texto de UI ---
        this.add.text(width / 2, 50, 'Arraste o lixo para a lixeira correta!', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.scoreText = this.add.text(width / 2, 100, 'Acertos: 0 / 5', { fontSize: '28px', fill: '#ffff00' }).setOrigin(0.5);
    
    
        this.input.on('dragstart', (pointer, lixo) => {
            lixo.setDepth(1);
        });
    
        this.input.on('drag', (pointer, lixo, dragX, dragY) => {
            lixo.setPosition(dragX, dragY);
        });
    
        this.input.on('drop', (pointer, lixo, lixeira) => {
            const tipoLixo = lixo.getData('tipo_lixo');
            const tipoLixeira = lixeira.getData('tipo_lixo_correto');
    
            if (tipoLixo === tipoLixeira) {
                this.score++;
                this.scoreText.setText(`Acertos: ${this.score} / ${this.scoreToWin}`);
                lixo.destroy();
                
                if (this.score >= this.scoreToWin) {
                    this.ganharJogo();
                }
            } else {
                lixo.setPosition(lixo.input.dragStartX, lixo.input.dragStartY);
                this.tweens.add({
                    targets: lixo,
                    alpha: 0.5,
                    duration: 100,
                    yoyo: true,
                    repeat: 1
                });
            }
        });
    
        this.input.on('dragend', (pointer, lixo, dropped) => {
            if (!dropped) {
                lixo.setPosition(lixo.input.dragStartX, lixo.input.dragStartY);
            }
            lixo.setDepth(0);
        });
        
        this.iniciarGeradorDeLixo();
    }

    iniciarGeradorDeLixo() {
        this.spawnTimer = this.time.addEvent({
            delay: 2500,
            callback: this.spawnLixo,
            callbackScope: this,
            loop: true
        });
        this.spawnLixo();
    }

    spawnLixo() {
        const { width } = this.scale;
        
        // 1. Escolhe um tipo aleatório das chaves disponíveis
        const chaves = Object.keys(this.configLixo);
        const tipoAleatorio = Phaser.Utils.Array.GetRandom(chaves);
        
        // 2. Pega o nome da imagem correspondente (ex: 'papel')
        const imagemKey = this.configLixo[tipoAleatorio].itemImg;

        const xPos = Phaser.Math.Between(width * 0.2, width * 0.8);
        
        // 3. Cria o sprite direto com a imagem correta (sem crop!)
        const lixo = this.physics.add.sprite(xPos, 200, imagemKey)
            .setData('tipo_lixo', tipoAleatorio)
            .setInteractive();
        
        this.input.setDraggable(lixo);
        
        // Ajuste a escala conforme o tamanho das suas imagens png
        lixo.setScale(0.2); 

        lixo.input.dragStartX = lixo.x;
        lixo.input.dragStartY = lixo.y;
    }

    ganharJogo() {
        this.spawnTimer.remove(); // Para de gerar lixo

        this.children.getAll().forEach(child => {
            if (child.getData('tipo_lixo')) child.destroy();
        });
        
        this.add.text(this.scale.width / 2, this.scale.height / 2, 'Muito bem!', { 
            fontSize: '40px', fill: '#00ff00', fontStyle: 'bold' 
        }).setOrigin(0.5);

        this.progressao.missaoCompleta(this.triggerID);
        
        this.time.delayedCall(2000, () => {
            this.sairDaCena();
        });
    }

    sairDaCena() {
        if (this.scene.isActive('Interface')) {
            this.scene.get('Interface').setAtiva(true);
        }
        this.scene.start('MundoAberto', this.returnPos);
    }
}