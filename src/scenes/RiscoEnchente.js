export default class RiscoEnchente extends Phaser.Scene {
    constructor() {
        super('RiscoEnchente');
        this.returnPos = {};
    }

    init(data) {
        this.returnPos = data;
    }
}