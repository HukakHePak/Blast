const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    // @property(cc.Label)
    // label: cc.Label = null;

    // @property
    // text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}



    @property
    soundOffset: number = 0


    start() {

    }

    // fire(node: cc.Node, config?: AnimationConfig) {
    //     const instance = cc.instantiate(node)

    //     node.parent.addChild(instance)

    //     Animation.play(instance)
    // }

    // update (dt) {}
}
