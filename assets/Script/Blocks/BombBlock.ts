// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Game from "../Game/Game";
import MapController from "../Map/MapController";
import SimplelBlock, { BlockTypes, BombTypes } from "./SimpleBlock";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BombBlock extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    parent: SimplelBlock

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        this.parent = this.getComponent(SimplelBlock)

        // this.node.on(cc.Node.EventType.TOUCH_START, () => this.onTouch())
    }

    handleBlock(block: SimplelBlock): number {
        // if (BombTypes.includes(block.type) && block !== this.parent) {
        if (BombTypes.includes(block.type)) {
            // block.onTouch()

            return 0
        }

        block.remove()
        return 1
    }

    onTouch() {
        const { game, mapController, type, column, row } = this.parent

        const { bombRadius, mapHeight, mapWidth } = mapController

        let fireCount = 0;

        switch (type) {
            case BlockTypes.BOMB:   //TODO: radius searching
                for (let x = column - bombRadius; x <= column + bombRadius; x++) {
                    for (let y = row - bombRadius; y <= row + bombRadius; y++) {
                        fireCount += this.handleBlock(mapController.getBlock(x, y))
                    }
                }
                this.parent.remove()

                break;
            case BlockTypes.BOMB_M:
                mapController.clear()
                fireCount = mapHeight * mapWidth - 1

                break;
            case BlockTypes.RACKETS:
                mapController.mapData[column].forEach(block => fireCount += this.handleBlock(block))

                this.parent.remove()
                break;
            case BlockTypes.RACKETS_H:
                mapController.mapData.forEach(column => fireCount += this.handleBlock(column[row]))
                this.parent.remove()
                break;
            default: break;
        }

        console.log(fireCount)

        game.levelController.fire(fireCount)

    }

    // update (dt) {}
}
