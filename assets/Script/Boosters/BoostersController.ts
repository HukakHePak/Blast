import Game from "../Game/Game";
import Booster from "./Booster";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BoostersController extends cc.Component {
    @property(cc.Node)
    boostersContainer: cc.Node = null;

    @property(cc.Node)
    boostersNode: cc.Node = null;

    game: Game = null;



    // boosters:

    active: Booster = null
    

    deactivate() {
        this.active = null
    }


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    init(game: Game) {
        this.game = game
    }

    start () {
        const boosters = this.boostersNode.getComponentsInChildren(Booster)

        boosters.map(booster => booster.init(this))
    }

    activate(booster: Booster) {
        this.active = booster
    }

    // update (dt) {}
}
