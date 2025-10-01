// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import FallBlock from "./FallBlock";

const { ccclass, property } = cc._decorator;

const boxTypes = cc.Enum({
    BLUE: 0,
    RED: 1
})

@ccclass
export default class FallBlocksMap extends cc.Component {

    // @property(cc.Label)
    // label: cc.Label = null;

    // @property
    // text: string = 'hello';

    columns: number = 9;
    rows: number = 8;

    map?: Array<Array<number>> = [];

    @property(cc.Node)
    fall_block: cc.Node = null

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        for (let i = 0; i < this.rows; i++) {
            const row = []

            for (let j = 0; j < this.columns; j++) {
                const block = cc.instantiate(this.fall_block)

                block.active = true

                this.node.addChild(block)

                row.push(block)
            }

            this.map.push(row)
        }
    }

    // update (dt) {}
}
