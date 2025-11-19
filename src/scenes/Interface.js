export default class Interface extends Phaser.Scene {
    constructor() {
        super('Interface');
        this.quantidadeMedalhasTexto = null;
        this.progressao = null;
        this.visivel = true;
        this.elementos = [];
    }

    create() {
        // Pega a cena de progressão 
        this.progressao = this.scene.get('Progressao');

        // Adiciona o ícone da medalha
        const medalha = this.add.image(40, 40, 'medalha')
        .setScrollFactor(0)
        .setDepth(100)
        .setScale(0.3);
        
        // Adiciona o texto da pontuação
        this.quantidadeMedalhasTexto = this.add.text(70, 28, '0', {
            fontSize: '32px',
            color: '#FFFFFF',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setScrollFactor(0).setDepth(100);

        // Guarda os elementos para controle de visibilidade
        this.elementos = [medalha, this.quantidadeMedalhasTexto];

        this.atualizarMedalhas(this.progressao.obterMedalhas());

        // Ouve por futuras atualizações de pontuação
        this.progressao.events.on('NovaMedalhaObtida', this.atualizarMedalhas, this);
        

        this.scene.bringToTop();
    }
    


    atualizarMedalhas(quantidadeMedalhas) {
        if (this.quantidadeMedalhasTexto) {
            this.quantidadeMedalhasTexto.setText(quantidadeMedalhas);
        }
    }

    setAtiva(ativa) {
        this.visivel = ativa;
        this.elementos.forEach(el => el.setVisible(ativa));
        this.input.enabled = ativa;
    }
}