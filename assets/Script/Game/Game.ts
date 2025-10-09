import LevelController from "../Level/LevelController";
import LevelMap from "../Level/LevelMap";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {
    @property(cc.Integer)
    animationSpeed = 1

    @property(cc.Integer)
    animationDurability = 0.5
    
    @property(cc.Integer)
    longAnimationMultiplier = 0.8

    @property(cc.Node)
    levelControllerNode: cc.Node = null

    levelController: LevelController = null


    // blockPool: cc.NodePool

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}



    start() { // TODO: spawn
        this.levelController = this.levelControllerNode.getComponent(LevelController)

        this.levelController.init(this)
    }


    update(dt) {

    }
}
