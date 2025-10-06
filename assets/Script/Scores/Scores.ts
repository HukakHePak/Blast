// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Scores extends cc.Component {

    // @property(cc.Label)
    // label: cc.Label = null;

    // @property
    // text: string = 'hello';

    score: number = 0

    @property
    maxScores: number = 10000

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
        // this.text = String(this.totalCount)
        // this.node.str
    }
}
