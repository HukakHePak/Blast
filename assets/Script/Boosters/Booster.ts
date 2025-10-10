import SimplelBlock, { BlockTypes } from "../Blocks/SimpleBlock";
import BoostersController from "./BoostersController";

const { ccclass, property } = cc._decorator;

export enum BoosterType {
    NONE = 0,
    BOMB = 1,
    TELEPORT = 2,
}

@ccclass
export default class Booster extends cc.Component {
    @property({ type: cc.Enum(BoosterType) })
    type: BoosterType = BoosterType.NONE;

    @property(cc.Integer)
    count: number = 0;

    @property(cc.Label)
    labelCount: cc.Label = null

    boostersController: BoostersController

    pickedBlock: SimplelBlock = null


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    init(boostersController: BoostersController) {
        this.boostersController = boostersController
    }

    start() {
        this.node.on(cc.Node.EventType.TOUCH_START, () => {
            this.onTouch()
        })


    }

    onTouch() {
        this.boostersController.activate(this)

        const { game } = this.boostersController

        cc.tween(this.node)
            .to((1 - game.longAnimationMultiplier) * game.animationDurability, { scale: 1.1 })
            .start()
    }

    use(block: SimplelBlock) {

        const { mapController } = this.boostersController.game.levelController

        switch (this.type) {
            case BoosterType.BOMB:
                mapController.removeBlock(block)
                this.boostersController.game.levelController.fire(1)

                mapController.createBlock(block.column, block.row, BlockTypes.BOMB)

                break;

            case BoosterType.TELEPORT:
                if (this.pickedBlock) {
                    mapController.swapBlocks(this.pickedBlock, block)
                } else {
                    this.pickedBlock = block
                    return;
                }
                break;

            default: break;
        }

        this.boostersController.deactivate()
        this.count -= 1
    }

    deactivate() {
        const { game } = this.boostersController

        cc.tween(this.node)
            .to((1 - game.longAnimationMultiplier) * game.animationDurability, { scale: 1 })
            .start()

        this.pickedBlock = null
    }

    update(dt) {
        this.labelCount.string = `${this.count}`
    }
}
