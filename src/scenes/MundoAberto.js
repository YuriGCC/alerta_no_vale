export default class MundoAberto extends Phaser.Scene {
    constructor() {
        super('MundoAberto');
        this.player = null;
        this.cursors = null;
        this.dpad = null;
        this.fadedTiles = []; 

        this.chaoLayer = null;
        this.carrosLayer = null;
        this.casasLayer = null;
        this.diversosLayer = null;
        this.rioLayer = null;

        this.progressao = null;
    }

    init(data) {
        this.startX = data.returnX || 1150; 
        this.startY = data.returnY || 300;
    }

    create() {
        // Checa da cena de progressão 
        this.progressao = this.scene.get('Progressao');

        const map = this.make.tilemap({ key: 'mapaJSON' });
        
        const tileset = map.addTilesetImage('tiles', 'mapa'); 

        this.chaoLayer = map.createLayer('ground', tileset, 0, 0);
        this.chaoLayer.setDepth(0);

        this.rioLayer = map.createLayer('river', tileset, 0, 0);
        this.rioLayer.setDepth(0);

        this.player = this.physics.add.sprite(this.startX, this.startY, 'amora');
        this.player.setDepth(0);
        this.player.body.debugShowBody = false;
        this.player.body.debugShowVelocity = false;

        this.player.body.setSize(24, 16);
        this.player.body.setOffset(4, 16); 

        this.carrosLayer = map.createLayer('cars', tileset, 0, 0);
        this.carrosLayer.setDepth(1);

        this.diversosLayer = map.createLayer('miscellaneous', tileset, 0, 0);
        this.diversosLayer.setDepth(2);

        this.casasLayer = map.createLayer('houses', tileset, 0, 0);
        this.casasLayer.setDepth(3); 

        // Configuração de colisão
        this.casasLayer.setCollisionByProperty({ collides: true });
        this.carrosLayer.setCollisionByProperty({ collides: true });
        this.diversosLayer.setCollisionByProperty({ collides: true });
        this.rioLayer.setCollisionByProperty({ collides: true });
 
        this.physics.add.collider(this.player, this.casasLayer);
        this.physics.add.collider(this.player, this.carrosLayer);
        this.physics.add.collider(this.player, this.diversosLayer);
        this.physics.add.collider(this.player, this.rioLayer);

        // Área de quiz
        const quizTrigger = map.findObject('triggers', obj => obj.name === 'gatilho_quiz');
        
        if (quizTrigger) {
            const quizZone = this.add.zone(
                quizTrigger.x + (quizTrigger.width / 2), 
                quizTrigger.y + (quizTrigger.height / 2), 
                quizTrigger.width, quizTrigger.height
                );
            this.physics.world.enable(quizZone);
            quizZone.body.setAllowGravity(false);
            quizZone.body.setImmovable(true);
        
            this.add.rectangle(quizZone.x, quizZone.y, quizZone.width, quizZone.height, 0xff0000, 0.3)
                .setOrigin(0.5, 0.5)
                .setDepth(99);
        
                this.physics.add.overlap(this.player, quizZone, () => {
                    if (!this.progressao.missaoFoiConcluida('gatilho_quiz')) {
                        quizZone.body.setEnable(false); 
    
                        this.scene.stop('MundoAberto');
                        this.scene.start('Quiz', { 
                            returnX: this.player.x, 
                            returnY: this.player.y + 20
                        });
                    }
                    
                }, null, this);

        }
        

        // Área de progressão
        const progressaoTrigger = map.findObject('triggers', obj => obj.name == 'gatilho_area_progressao')
        
        if (progressaoTrigger) {
            const progressaoZone = this.add.zone(
                progressaoTrigger.x + (progressaoTrigger.width / 2), 
                progressaoTrigger.y + (progressaoTrigger.height / 2), 
                progressaoTrigger.width, progressaoTrigger.height
                );
            this.physics.world.enable(progressaoZone);
            progressaoZone.body.setAllowGravity(false);
            progressaoZone.body.setImmovable(true);

            this.physics.add.overlap(this.player, progressaoTrigger, () => {
            }, null, this);
        }

        // Área pé de vento
        const peDeVentoTrigger = map.findObject('triggers', obj => obj.name == 'gatilho_pe_de_vento')
        if (peDeVentoTrigger) {
            const peDeVentoZone = this.add.zone(
                peDeVentoTrigger.x + (peDeVentoTrigger.width / 2), 
                peDeVentoTrigger.y + (peDeVentoTrigger.height / 2), 
                peDeVentoTrigger.width, peDeVentoTrigger.height
                );
            this.physics.world.enable(peDeVentoZone);
            peDeVentoZone.body.setAllowGravity(false);
            peDeVentoZone.body.setImmovable(true);

            this.physics.add.overlap(this.player, peDeVentoTrigger, () => {
            }, null, this);
        }

        // Área risco de enchente
        const riscoEnchenteTrigger = map.findObject('triggers', obj => obj.name == 'gatilho_risco_enchente')
        if (riscoEnchenteTrigger) {
            const enchenteZone = this.add.zone(
                riscoEnchenteTrigger.x + (riscoEnchenteTrigger.width / 2), 
                riscoEnchenteTrigger.y + (riscoEnchenteTrigger.height / 2), 
                riscoEnchenteTrigger.width, riscoEnchenteTrigger.height
                );
            this.physics.world.enable(enchenteZone);
            enchenteZone.body.setAllowGravity(false);
            enchenteZone.body.setImmovable(true);

            this.physics.add.overlap(this.player, riscoEnchenteTrigger, () => {
            }, null, this);
        }

        // Área arrasta e solta
        const arrastaSoltaTrigger = map.findObject('triggers', obj => obj.name == 'gatilho_arrasta_solta_quiz')
        if (arrastaSoltaTrigger) {
            const arrastaSoltaZone = this.add.zone(
                arrastaSoltaTrigger.x + (arrastaSoltaTrigger.width / 2), 
                arrastaSoltaTrigger.y + (arrastaSoltaTrigger.height / 2), 
                arrastaSoltaTrigger.width, arrastaSoltaTrigger.height
                );
            this.physics.world.enable(arrastaSoltaZone);
            arrastaSoltaZone.body.setAllowGravity(false);
            arrastaSoltaZone.body.setImmovable(true);

            this.physics.add.overlap(this.player, arrastaSoltaTrigger, () => {
            }, null, this);
        }

        // Área sete erros
        const seteErrosTrigger = map.findObject('triggers', obj => obj.name == 'gatilho_sete_erros')
        if (seteErrosTrigger) {
            const seteErrosZone = this.add.zone(
                seteErrosTrigger.x + (seteErrosTrigger.width / 2), 
                seteErrosTrigger.y + (seteErrosTrigger.height / 2), 
                seteErrosTrigger.width, seteErrosTrigger.height
                );
            this.physics.world.enable(seteErrosZone);
            seteErrosZone.body.setAllowGravity(false);
            seteErrosZone.body.setImmovable(true);

            this.physics.add.overlap(this.player, seteErrosTrigger, () => {
            }, null, this);
        }

        // Área risco deslizamento
        const riscoDeslizamento = map.findObject('triggers', obj => obj.name == 'gatilho_risco_deslizamento')
        if (riscoDeslizamento) {
            const riscoDeslizamentoZone = this.add.zone(
                riscoDeslizamento.x + (riscoDeslizamento.width / 2), 
                riscoDeslizamento.y + (riscoDeslizamento.height / 2), 
                riscoDeslizamento.width, riscoDeslizamento.height
                );
            this.physics.world.enable(riscoDeslizamentoZone);
            riscoDeslizamentoZone.body.setAllowGravity(false);
            riscoDeslizamentoZone.body.setImmovable(true);

            this.physics.add.overlap(this.player, riscoDeslizamentoZone, () => {
            }, null, this);
        }

        // Áreas de separação de lixo
        var separarLixoAreas = []

        for (var i = 0; i <= 4; i++) {
            separarLixoAreas.push(
                map.findObject('triggers', obj => obj.name == `gatilho_separar_lixo_${i + 1}`)
            );
        }

        for (const separarLixoZone of separarLixoAreas) {
            if (separarLixoZone) {
                
                // Verifica se a zona foi rotacionada para a vertical e faz a rotacao
                let isRotated = false;
                if (separarLixoZone.properties) {
                     for (let prop of separarLixoZone.properties) {
                        if (prop.name === 'isRotated' && prop.value === true) {
                            isRotated = true;
                            break;
                        }
                     }
                }
        
                let zoneX, zoneY, zoneWidth, zoneHeight;
        
                if (isRotated) {
                    zoneWidth = separarLixoZone.height; 
                    zoneHeight = separarLixoZone.width;
                    
                    zoneX = separarLixoZone.x + (zoneWidth / 2);
                    zoneY = separarLixoZone.y - (zoneHeight / 2);
        
                } else {
                    zoneWidth = separarLixoZone.width;
                    zoneHeight = separarLixoZone.height;
                    zoneX = separarLixoZone.x + (zoneWidth / 2);
                    zoneY = separarLixoZone.y + (zoneHeight / 2);
                }
        
                const lixoZone = this.add.zone(zoneX, zoneY, zoneWidth, zoneHeight);
        
                this.physics.world.enable(lixoZone);
                lixoZone.body.setAllowGravity(false);
                lixoZone.body.setImmovable(true);
                
                this.physics.add.overlap(this.player, lixoZone, () => {
                }, null, this);
            }
        }

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setRoundPixels(true);

        this.anims.create({
            key: 'andando',
            frames: this.anims.generateFrameNumbers('amora', { start: 32, end: 38 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'parado',
            frames: this.anims.generateFrameNumbers('amora', { start: 9, end: 12 }),
            frameRate: 10,
            repeat: -1
        });

        this.cursors = this.input.keyboard.createCursorKeys();
        
        this.player.setCollideWorldBounds(true);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        if (this.scene.isActive('Interface')) {

            this.scene.setVisible(true, 'Interface');
            this.scene.bringToTop('Interface');
        
        } else {
            this.scene.launch('Interface');
        }

        this.createDpad();
    }

    createDpad() {
        const buttonSize = 50; 
        const buttonSpacing = 60;
        const dpadAlpha = 0.5;
        const dpadDepth = 100; 

        const baseX = buttonSpacing * 2;
        const baseY = this.scale.height - buttonSpacing ;

        const arrowUp = this.add.rectangle(baseX, baseY - buttonSpacing, buttonSize, buttonSize, 0x000000, dpadAlpha)
            .setInteractive().setScrollFactor(0).setDepth(dpadDepth);
        const arrowDown = this.add.rectangle(baseX, baseY, buttonSize, buttonSize, 0x000000, dpadAlpha)
            .setInteractive().setScrollFactor(0).setDepth(dpadDepth);
        const arrowLeft = this.add.rectangle(baseX - buttonSpacing, baseY, buttonSize, buttonSize, 0x000000, dpadAlpha)
            .setInteractive().setScrollFactor(0).setDepth(dpadDepth);
        const arrowRight = this.add.rectangle(baseX + buttonSpacing, baseY, buttonSize, buttonSize, 0x000000, dpadAlpha)
            .setInteractive().setScrollFactor(0).setDepth(dpadDepth);

        arrowUp.isDown = false;
        arrowDown.isDown = false;
        arrowLeft.isDown = false;
        arrowRight.isDown = false;

        this.dpad = {
            up: arrowUp,
            down: arrowDown,
            left: arrowLeft,
            right: arrowRight
        };

        const setupButtonEvents = (button) => {
            button.on('pointerdown', () => { button.isDown = true; });
            button.on('pointerup', () => { button.isDown = false; });
            button.on('pointerout', () => { button.isDown = false; }); 
        };

        setupButtonEvents(arrowUp);
        setupButtonEvents(arrowDown);
        setupButtonEvents(arrowLeft);
        setupButtonEvents(arrowRight);
    }

    update() {
        const speed = 160;
        this.player.setVelocity(0);

        const dpadLeft = this.dpad && this.dpad.left.isDown;
        const dpadRight = this.dpad && this.dpad.right.isDown;
        const dpadUp = this.dpad && this.dpad.up.isDown;
        const dpadDown = this.dpad && this.dpad.down.isDown;

        if (this.cursors.left.isDown || dpadLeft) {
            this.player.setVelocityX(-speed);
            this.player.anims.play('andando', true); 
            this.player.setFlipX(false);
        } else if (this.cursors.right.isDown || dpadRight) {
            this.player.setVelocityX(speed);
            this.player.anims.play('andando', true); 
            this.player.setFlipX(true);
        } else if (this.cursors.up.isDown || dpadUp) {
            this.player.setVelocityY(-speed);
            this.player.anims.play('andando', true); 
            this.player.setFlipX(false);
        } else if (this.cursors.down.isDown || dpadDown) {
            this.player.setVelocityY(speed);
            this.player.anims.play('andando', true); 
            this.player.setFlipX(false);
        } else {
            this.player.setVelocity(0);
            
            const currentAnim = this.player.anims.currentAnim;
            if (currentAnim) {
                if (currentAnim.key === 'andando' && this.player.flipX) {
                    this.player.anims.play('parado', true);
                } else if (currentAnim.key == 'andando') {
                    this.player.anims.play('parado', true);
                } else {
                    this.player.anims.play('parado', true);
                }
            } else {
                this.player.anims.play('parado', true);
            }
        }

        // Limpa os tiles transparentes
        if (Array.isArray(this.fadedTiles)) {
            for (const tile of this.fadedTiles) {
                if (tile) { 
                    tile.alpha = 1.0;
                }
            }
        }
        this.fadedTiles = [];

        // Define a área em volta do jogador que é verificada a sobreposição
        const playerX = this.player.x;
        const playerY = this.player.y;
        const fadeRadius = 32; // 32 pixels à volta do centro do jogador
        const fadeAlpha = 0.4; // Nível de transparência

        // Encontra todos os tiles dentro dessa área nas camadas de sobreposição
        const tilesToFade = [
            ...this.casasLayer.getTilesWithinWorldXY(playerX - fadeRadius, playerY - fadeRadius, fadeRadius * 2, fadeRadius * 2),
            ...this.diversosLayer.getTilesWithinWorldXY(playerX - fadeRadius, playerY - fadeRadius, fadeRadius * 2, fadeRadius * 2)
        ];
        
        // Aplica o novo alfa e guarda os tiles
        for (const tile of tilesToFade) {
            if (tile) {
                tile.alpha = fadeAlpha;
                this.fadedTiles.push(tile);
            }
        }
    }
}