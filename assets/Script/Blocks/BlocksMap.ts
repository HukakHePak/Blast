// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;



const BOX_STATE = cc.Enum({
    SPAWN: 0,
    IDLE: 1,
    FALL: 2,
    DEAD: 3,
})


interface GridPosition {
    x: 0,
    y: 0,
}

// interface Block {
//     type: string,
//     gridPosition: GridPosition,
//     state: 
// }

@ccclass
export default class BlocksMap extends cc.Component {

    // @property(cc.Label)
    // label: cc.Label = null;

    // @property
    // text: string = 'hello';

    map?: Array<Array<cc.Node>> = [];

    @property 
    map_width: number = 8

    @property
    map_height: number = 9

    @property
    blocks_gap: number = 5

    


    @property(cc.Node)
    fall_block: cc.Node = null

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        const width = this.map_width * (this.fall_block.width + this.blocks_gap) - this.blocks_gap
        const height = this.map_height * (this.fall_block.height + this.blocks_gap) - this.blocks_gap

        this.node.width = width
        this.node.height = height

        // this.node.x = -width / 2
        // this.node.y = -height / 2

        for (let i = 0; i < this.map_width; i++) {
            const row = []

            for (let j = 0; j < this.map_height; j++) {
                const block = cc.instantiate(this.fall_block)

                block.active = true

                block.x = (block.width + this.blocks_gap) * i
                block.y = (block.height + this.blocks_gap) * j

                this.node.addChild(block)
                
                

                // block.name

                // block.type

                row.push(block)
            }

            this.map.push(row)
        }
    }

    // private onFallBlockClick

    // update (dt) {}
}
