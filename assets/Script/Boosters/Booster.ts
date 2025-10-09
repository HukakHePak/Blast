import BoostersController from "./BoostersController";

const { ccclass, property } = cc._decorator;

export enum BoosterType {
    NONE = 0,
    BOMB = 1,
    TELEPORT = 2,
}

// cc.Enum(BoosterType)

// export const BoosterType = cc.Enum({
//     BOMB: 0,
// })

@ccclass
export default class Booster extends cc.Component {
    @property({ type: cc.Enum(BoosterType) })
    type: BoosterType = BoosterType.NONE;
    // type = null;

    @property(cc.Integer)
    count: number = 0;

    @property(cc.Label)
    labelCount: cc.Label = null

    boostersController: BoostersController


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

    use() {
        this.count -= 1

        switch (this.type) {
            case BoosterType.BOMB:
                break;

            case BoosterType.TELEPORT:
                break;

            default: break;
        }

        this.boostersController.deactivate()

        const { game } = this.boostersController
        
        cc.tween(this.node)
            .to((1 - game.longAnimationMultiplier) * game.animationDurability, { scale: 1 })
            .start()
    }

    update(dt) {
        this.labelCount.string = `${this.count}`
    }
}
