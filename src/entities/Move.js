export default class Move {
    constructor(name, type, basePower) {
        this.name = name;
        this.type = type;
        this.basePower = basePower;
    }

    getDamage() {
        return this.basePower;
    }
}