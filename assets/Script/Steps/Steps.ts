const { ccclass, property } = cc._decorator;

@ccclass
export default class Steps extends cc.Component {
    @property(cc.Integer)
    steps: number = 10

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        this.updateLabel()
    }

    setInitialSteps(count: number) {
        this.steps = count
    }

    step() {
        this.steps = this.steps - 1

        this.updateLabel()
    }

    updateLabel() {
        const label = this.node.getComponent(cc.Label)

        label.string = `${this.steps}`
    }

    update(dt) {
    }
}
