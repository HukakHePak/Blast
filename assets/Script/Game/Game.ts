import LevelController from "../Level/LevelController";
import Media from "../Media/Media";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {
    @property(cc.Integer)
    animationDurability = 0.5
    
    @property(cc.Integer)
    longAnimationMultiplier = 0.8

    @property(cc.Node)
    levelControllerNode: cc.Node = null
    
    levelController: LevelController = null

    @property(cc.Node)
    mediaNode: cc.Node = null

    media: Media = null

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}



    start() {
        this.levelController = this.levelControllerNode.getComponent(LevelController)

        this.levelController.init(this)

        this.media = this.mediaNode.getComponent(Media)

        // this.media.init(this)
    }


    update(dt) {

    }
}
