const { ccclass, property } = cc._decorator;

@ccclass
export default class Media extends cc.Component {

    // @property(cc.Label)
    // label: cc.Label = null;

    // @property
    // text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    @property(cc.Node)
    lux: cc.Node = null;

    @property(cc.Node)
    explosion: cc.Node = null

    @property(cc.Node)
    screamsNode: cc.Node = null

    // screams: 

    // @property(cc.Node)
    // lux: cc.Node = null;

    onLoad () {

    }

    start() {

    }

    // update (dt) {}
}
