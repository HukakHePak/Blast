import Animates, { AnimatesConfig } from "../Utils/Animates";
import { selectAny } from "../Utils/utils";
import SimplelBlock, { BlockTypes } from "./SimpleBlock";

const { ccclass } = cc._decorator;

@ccclass
export default class BombBlock extends cc.Component {
    parent: SimplelBlock

    isTouched: boolean = false

    start() {
        this.parent = this.getComponent(SimplelBlock)
    }

    handleBlocks(blocks: SimplelBlock[]) {
        const removableBlocks = blocks.filter(block => block?.type < BlockTypes.BOMB)

        const { game, mapController } = this.parent

        game.media.screams.playParallel(removableBlocks.length)
        mapController.removeBlocks([this.parent, ...removableBlocks])
        game.levelController.fire(removableBlocks.length)
    }

    onTouch() {
        if (this.isTouched) return

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

                Animates.play(game.media.explosion, { target: mapNode, x: mapNode.width / 2, y: mapNode.height / 2 })
                Animates.play(game.trembleScreenNode)

                return;

            case BlockTypes.RACKETS:
                fireBlocks.push(...mapController.mapData[column])

                Animates.play(game.media.lux, {
                    x: this.node.x,
                    target: mapNode,
                    ...selectAny([{ angle: 90, y: mapNode.height, }, { angle: -90 }])
                } as AnimatesConfig)

                break;

            case BlockTypes.RACKETS_H:
                fireBlocks.push(...mapController.mapData.map(column => column[row]))

                Animates.play(game.media.lux, {
                    y: this.node.y,
                    target: mapNode,
                    ...selectAny([{ x: mapNode.width }, { angle: 180 }])
                } as AnimatesConfig)
                break;

            default: break;
        }

        this.handleBlocks(fireBlocks)
    }

    // update (dt) {}
}
