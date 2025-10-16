import BoostersController from "../Boosters/BoostersController";
import Game from "../Game/Game";
import MapController from "../Map/MapController";
import Animates from "../Utils/Animates";

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

    @property(cc.Node)
    boostersNode: cc.Node = null

    boostersController: BoostersController

    game: Game = null


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {        
        this.victoryNode.on(cc.Node.EventType.TOUCH_START, () => this.restart())
        this.defeatNode.on(cc.Node.EventType.TOUCH_START, () => this.restart())
    }
    
    init(game: Game) {
        this.mapController = this.mapNode.getComponent(MapController)
        this.boostersController = this.boostersNode.getComponent(BoostersController)

        this.game = game
        
        this.boostersController.init(game)
    }

    shake() {
        this.mapShakes += 1

        console.log(this.mapShakes)

        if (this.mapShakes > this.mapShakesLimit) {
            this.defeat()
        }
    }

    fire(count: number) {
        this.scores += count
        this.steps += 1

        Animates.play(this.stepsLabel.node)
        Animates.play(this.scoresLabel.node)

        if (this.scores >= this.scoresLimit) {
            this.victory()

            return
        }

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
        this.mapShakes = 0

        this.mapController.clear()
    }

    updateLabels() {
        this.stepsLabel.string = `${this.stepsLimit - this.steps}`
        this.scoresLabel.string = `${this.scores}/${this.scoresLimit}`
    }

    update(dt) {
        this.updateLabels()
    }
}
