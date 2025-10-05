const {ccclass, property} = cc._decorator;

// export const BOX_TYPE = cc.Enum({
//     BLUE: 0,
//     RED: 1
// })

@ccclass
export default class SimplelBlock extends cc.Component {
    // color: string = 'blue'
    

    @property
    type: string = ''
    
    column: number = 0
    row: number = 0


    // @property(cc.Label)
    // label: cc.Label = null;

    // @property
    // text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouch )


        // this.node.x

    }

    onTouch () {
        console.log(this)
    }

    public setRow(size: number): void {
        this.row = size
    }

    // update (dt) {}
}
