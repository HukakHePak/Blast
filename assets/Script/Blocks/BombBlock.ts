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

    handleBlock(block: SimplelBlock): SimplelBlock {
        // if (BombTypes.includes(block.type) && block !== this.parent) {
        if (BombTypes.includes(block.type)) {
            // block.onTouch()

            return null
        }

        // this.parent.mapController.removeBlock(block)

        return block
    }

    onTouch() {
        const { game, mapController, type, column, row } = this.parent

        const { bombRadius, mapHeight, mapWidth } = mapController

        const fireBlocks = [];

        switch (type) {
            case BlockTypes.BOMB:   //TODO: radius searching
                for (let x = column - bombRadius; x <= column + bombRadius; x++) {
                    for (let y = row - bombRadius; y <= row + bombRadius; y++) {
                        fireBlocks.push(this.handleBlock(mapController.getBlock(x, y)))
                    }
                }
                break;

            case BlockTypes.BOMB_M:
                mapController.clear()
                game.levelController.fire(mapHeight * mapWidth - 1)
                return;

            case BlockTypes.RACKETS:
                mapController.mapData[column].forEach(block => fireBlocks.push(this.handleBlock(block)))
                break;

            case BlockTypes.RACKETS_H:
                mapController.mapData.forEach(column => fireBlocks.push(this.handleBlock(column[row])))
                break;

            default: break;
        }

        mapController.removeBlocks([this.parent, ...fireBlocks])

        game.levelController.fire(fireBlocks.filter(block => block).length)

    }

    // update (dt) {}
}
