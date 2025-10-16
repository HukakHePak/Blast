import Game from "../Game/Game";
import Booster, { BoosterType } from "./Booster";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BoostersController extends cc.Component {
    @property(cc.Node)
    boostersNode: cc.Node = null;

    boosters: Booster[] = null;

    game: Game = null;

    active: Booster = null
    

    deactivate() {
        this.active.deactivate()
        this.active = null
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.boosters = this.boostersNode.getComponentsInChildren(Booster)
    }

    init(game: Game) {
        this.game = game
        this.boosters.forEach(booster => booster.init(this))
    }

    get hasBoosters(): boolean {
        return this.boosters.some(booster => booster.count)
    }

    
    start () {
    }

    activate(booster: Booster) {
        this.active?.deactivate()
        this.active = booster
    }

    updateCount(type: BoosterType, count: number ) {
        const booster = this.boosters.find(booster => booster.type === type)

        if(!booster) return

        booster.count = count
    }

    // update (dt) {}
}
