const { ccclass, property } = cc._decorator;

@ccclass
export default class Scores extends cc.Component {

    // @property(cc.Label)
    // label: cc.Label = null;

    // @property
    // text: string = 'hello';

    score: number = 0

    @property
    maxScores: number = 50

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        this.updateLabel()
    }

    setMaxScores(count: number) {
        this.maxScores = count
    }

    add(count: number) {
        this.score += count

        this.updateLabel()
    }

    updateLabel() {
        const label = this.node.getComponent(cc.Label)

        label.string = `${this.score}/${this.maxScores}`
    }

    update(dt) {
    }
}
