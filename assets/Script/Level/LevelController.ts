import Game from "../Game/Game";
import MapController, { MapControllerState } from "../Map/MapController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LevelController extends cc.Component {
    @property(cc.Node)
    victoryNode: cc.Node = null;

    @property(cc.Node)
    defeatNode: cc.Node = null;

    @property(cc.Label)
    scoresLabel: cc.Label = null

    @property(cc.Label)
    stepsLabel: cc.Label = null

    @property(cc.Node)
    mapNode: cc.Node = null

    mapController: MapController = null

    // @property
    steps = 0

    @property
    stepsLimit = 10

    // @property
    scores = 0

    @property
    scoresLimit = 100

    mapShakes = 0

    @property
    mapShakesLimit = 3


    // levelMap: LevelMap

    game: Game = null


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        this.mapController = this.mapNode.getComponent(MapController)
        this.victoryNode.on(cc.Node.EventType.TOUCH_START, () => this.restart())
        this.defeatNode.on(cc.Node.EventType.TOUCH_START, () => this.restart())
    }

    init(game: Game) {
        this.game = game

        // this.levelMap.init(game)
    }

    fire(count: number) {
        this.scores += count
        this.steps += 1

        if (this.scores >= this.scoresLimit) {
            this.victory()

            return
        }

        // const mapNeedShake = !this.mapController.needShake

        // if(this.mapController.needShake && this.mapShakes < this.mapShakesLimit) {
        //     this.mapController.shake()
        // }

        

        this.scheduleOnce(() => {
            if (!this.mapController.needShake) return

            if (this.mapShakes < this.mapShakesLimit) {
                this.mapController.clear()
                this.mapShakes += 1
            } else {
                this.defeat()
            }
        }, this.game.animationDurability * 4)

        // cc.act

        if (this.steps >= this.stepsLimit) {
            this.defeat()
        }
    }

    victory() {
        this.victoryNode.active = true
    }

    defeat() {
        this.defeatNode.active = true
    }

    restart() {
        this.victoryNode.active = false
        this.defeatNode.active = false
        this.steps = 0
        this.scores = 0
        // this.mapShakes = 0
    }

    updateLabels() {
        this.stepsLabel.string = `${this.stepsLimit - this.steps}`
        this.scoresLabel.string = `${this.scores}/${this.scoresLimit}`
    }

    update(dt) {
        this.updateLabels()
        // this.checkShakes()
    }
}
