export default class SepararLixo extends Phaser.Scene {
    constructor() {
        super('SepararLixo');

        this.lixeirasMap = {
            'vidro': 0,   
            'papel': 1,    
            'plastico': 2,
            'organico': 3   
        };

        this.tiposDeLixo = {
            'papel':    { x: 30,  y: 20,  w: 230, h: 210 },
            'plastico': { x: 30,  y: 280, w: 230, h: 200 },
            'vidro':    { x: 300, y: 20,  w: 230, h: 210 },
            'organico': { x: 620, y: 280, w: 230, h: 200 }
        };

        this.returnPos = {};
        this.progressao = null;
        this.triggerID = '';

        this.score = 0;
        this.scoreToWin = 5; // Precisa de acertar 5 lixos
        this.scoreText = null;
        this.spawnTimer = null;
    }

    init(data) {
        this.returnPos = data.returnPos || {};
        this.triggerID = data.triggerID || 'gatilho_separar_lixo_1'; // O ID do gatilho que nos chamou
    }

    create() {
        const { width, height } = this.scale;
        this.cameras.main.setBackgroundColor('#333333'); // Fundo cinzento escuro

        // Obter referências
        this.progressao = this.scene.get('Progressao');
        if (this.scene.isActive('Interface')) {
            this.scene.get('Interface').setAtiva(false); // Esconde o HUD
        }
        
        this.score = 0;

        // --- Criar as Lixeiras (Drop Zones) ---
        const yPos = height * 0.85; // Posição Y das lixeiras
        this.lixeiras = this.physics.add.group(); // Grupo de física para as lixeiras

        // Criar as 4 lixeiras
        Object.keys(this.lixeirasMap).forEach((tipo, index) => {
            const xPos = (width * (index + 1)) / 5; // Espaçar 4 lixeiras
            const frame = this.lixeirasMap[tipo];
            
            const lixeira = this.lixeiras.create(xPos, yPos, 'lixeiras', frame)
                .setData('tipo_lixo_correto', tipo)
                .setImmovable(true); // Fica parada

            // Ativar a lixeira como uma zona de drop
            lixeira.setInteractive();
            lixeira.input.dropZone = true;

            // Destaque visual (debug)
            // this.input.enableDebug(lixeira); 
        });


        // --- Texto de UI (Pontuação) ---
        this.add.text(width / 2, 50, 'Arraste o lixo para a lixeira correta!', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.scoreText = this.add.text(width / 2, 100, 'Acertos: 0 / 5', { fontSize: '28px', fill: '#ffff00' }).setOrigin(0.5);


        // --- Eventos de Drag & Drop ---
        this.input.on('dragstart', (pointer, lixo) => {
            lixo.setDepth(1); // Lixo fica por cima de tudo ao arrastar
        });

        this.input.on('drag', (pointer, lixo, dragX, dragY) => {
            lixo.setPosition(dragX, dragY);
        });

        this.input.on('drop', (pointer, lixo, lixeira) => {
            const tipoLixo = lixo.getData('tipo_lixo');
            const tipoLixeira = lixeira.getData('tipo_lixo_correto');

            if (tipoLixo === tipoLixeira) {
                // --- ACERTOU ---
                this.score++;
                this.scoreText.setText(`Acertos: ${this.score} / ${this.scoreToWin}`);
                lixo.destroy(); // Destrói o lixo
                
                // (Tocar som de acerto)

                if (this.score >= this.scoreToWin) {
                    this.ganharJogo();
                }
            } else {
                // --- ERROU ---
                lixo.setPosition(lixo.input.dragStartX, lixo.input.dragStartY); // Volta ao início
                // (Tocar som de erro)
            }
        });

        this.input.on('dragend', (pointer, lixo, dropped) => {
            if (!dropped) {
                // Se largar fora de uma lixeira, volta ao início
                lixo.setPosition(lixo.input.dragStartX, lixo.input.dragStartY);
            }
            lixo.setDepth(0);
        });
        
        // --- Iniciar o Jogo ---
        this.iniciarGeradorDeLixo();
    }

    iniciarGeradorDeLixo() {
        // Gera um lixo novo a cada 2.5 segundos
        this.spawnTimer = this.time.addEvent({
            delay: 2500,
            callback: this.spawnLixo,
            callbackScope: this,
            loop: true
        });

        // Gera o primeiro lixo imediatamente
        this.spawnLixo();
    }

    spawnLixo() {
        const { width } = this.scale;
        
        // Escolhe um tipo de lixo aleatório (Papel, Plastico, Vidro, Organico)
        const tiposDisponiveis = Object.keys(this.tiposDeLixo);
        const tipoAleatorio = Phaser.Utils.Array.GetRandom(tiposDisponiveis); // ex: "papel"
        
        // Pega os dados do "corte" (crop)
        const cropData = this.tiposDeLixo[tipoAleatorio];
        
        // Posição X aleatória no topo
        const xPos = Phaser.Math.Between(width * 0.2, width * 0.8);
        
        // --- [NOVO] LÓGICA DE 'setCrop' ---
        
        // 1. Cria o sprite usando a IMAGEM INTEIRA
        const lixo = this.add.sprite(xPos, 200, 'lixo_atlas')
            .setData('tipo_lixo', tipoAleatorio)
            .setInteractive();
        
        // 2. "Corta" o sprite para mostrar apenas a parte que queremos
        lixo.setCrop(cropData.x, cropData.y, cropData.w, cropData.h);
            
        // 3. Ajusta a escala (sprites de um atlas são grandes)
        lixo.setScale(0.5); // Ajuste este valor

        this.input.setDraggable(lixo);
        
        // (Guarda a posição inicial para o 'dragend')
        lixo.input.dragStartX = lixo.x;
        lixo.input.dragStartY = lixo.y;
    }

    ganharJogo() {
        // Remove todos os lixos
        this.children.getAll().forEach(child => {
            if (child.getData('tipo_lixo')) {
                child.destroy();
            }
        });
        
        this.add.text(this.scale.width / 2, this.scale.height / 2, 'Muito bem!', { 
            fontSize: '40px', fill: '#00ff00', fontStyle: 'bold' 
        }).setOrigin(0.5);


        this.progressao.missaoCompleta(this.triggerID);
        
        // Espera 2 segundos e volta ao mundo aberto
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