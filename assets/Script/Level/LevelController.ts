// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Game from "../Game/Game";
import LevelMap from "./LevelMap";

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

    @property
    steps = 0

    @property
    scores = 0

    @property
    stepsLimit = 10

    @property
    scoresLimit = 100

    // levelMap: LevelMap

    // game: Game = null


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        // this.levelMap = this.mapNode.getComponent(LevelMap)
        this.victoryNode.on(cc.Node.EventType.TOUCH_START, () => this.restart())
        this.defeatNode.on(cc.Node.EventType.TOUCH_START, () => this.restart())
    }

    init(game: Game) {
        // this.game = game

        // this.levelMap.init(game)
    }

    fire(count) {
        
        this.scores += count
        this.steps += 1

        if(this.scores >= this.scoresLimit) {
            this.victory()

            return
        }

        if(this.steps >= this.stepsLimit) {
            this.defeat()
        }

        // this.stepsLabel.string = 
    }

    // addScores(count: number) {
    //     this.scores += count
    //     this.scoresLabel.string = `${this.scores}/${this.scoresLimit}`
    // }

    // step() {
    //     this.steps += 1
    //     this.stepsLabel.string = `${this.stepsLimit - this.steps}`
    // }

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
    }

    update(dt) { 
        this.stepsLabel.string = `${this.stepsLimit - this.steps}`
        this.scoresLabel.string = `${this.scores}/${this.scoresLimit}`
    }
}
