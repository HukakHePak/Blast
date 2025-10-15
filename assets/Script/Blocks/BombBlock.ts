import Animation, { AnimationConfig } from "../Utils/Animation";
import { selectAny } from "../Utils/utils";
import SimplelBlock, { BlockTypes } from "./SimpleBlock";

const { ccclass } = cc._decorator;

@ccclass
export default class BombBlock extends cc.Component {
    parent: SimplelBlock

    start() {
        this.parent = this.getComponent(SimplelBlock)
    }

    handleBlocks(blocks: SimplelBlock[]) {
        const clearBombs = blocks.filter(block => block?.type < BlockTypes.BOMB)

        this.parent.mapController.removeBlocks([this.parent, ...clearBombs])
        this.parent.game.levelController.fire(clearBombs.length)
    }

    onTouch() {
        const { game, mapController, type, column, row } = this.parent
        const { bombRadius, mapHeight, mapWidth, mapNode } = mapController

        const fireBlocks = [];

        switch (type) {
            case BlockTypes.BOMB:
                for (let x = column - bombRadius; x <= column + bombRadius; x++) {
                    for (let y = row - bombRadius; y <= row + bombRadius; y++) {
                        fireBlocks.push(mapController.getBlock(x, y))
                    }
                }
                break;

            case BlockTypes.BOMB_M:
                mapController.clear()
                game.levelController.fire(mapHeight * mapWidth - 1)
                return;

            case BlockTypes.RACKETS:
                fireBlocks.push(...mapController.mapData[column])

                Animation.play(this.parent.game.media.lux, {
                    x: this.node.x,
                    target: mapNode,
                    ...selectAny([{ angle: 90, y: mapNode.height, }, { angle: -90 }])
                } as AnimationConfig)

                break;

            case BlockTypes.RACKETS_H:
                fireBlocks.push(...mapController.mapData.map(column => column[row]))

                Animation.play(this.parent.game.media.lux, {
                    y: this.node.y,
                    target: mapNode,
                    ...selectAny([{ x: mapNode.width }, { angle: 180 }])
                } as AnimationConfig)

                break;

            default: break;
        }

        this.handleBlocks(fireBlocks)
    }

    // update (dt) {}
}
