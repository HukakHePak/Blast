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
        const { game } = this.boostersController

        const { mapController } = game.levelController

        switch (this.type) {
            case BoosterType.BOMB:
                cc.tween(block.node)
                    .to(game.animationDurability * (1 - game.longAnimationMultiplier), { scale: 1 })
                    .to(game.animationDurability * game.longAnimationMultiplier, { scale: 0 })
                    .call(() => {
                        block.remove()
                    })
                    .start()

                mapController.createBlock(block.column, block.row, BlockTypes.BOMB)

                break;

            case BoosterType.TELEPORT:
                if(this.pickedBlock === block) {
                    game.media.sounds.playSound('alert')
                    return
                }

                if (this.pickedBlock) {
                    mapController.swapBlocks(this.pickedBlock, block)
                    this.pickedBlock.node.angle = 0
                    this.pickedBlock = null

                    game.media.sounds.playSound('airplane')
                    game.media.sounds.getSound('helicopter').stop()
                } else {
                    this.pickedBlock = block

                    game.media.sounds.playSound('helicopter')
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

        if (this.pickedBlock) {
            this.pickedBlock.node.angle += (this.count % 2 ? 1 : -1) * this.boostersController.game.animationDurability * dt * 1000
        }
    }
}
