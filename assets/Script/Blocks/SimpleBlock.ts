import Game from "../Game/Game";

const { ccclass, property } = cc._decorator;

// export const BOX_TYPE = cc.Enum({
//     BLUE: 0,
//     RED: 1
// })

@ccclass
export default class SimplelBlock extends cc.Component {
    // color: string = 'blue'


    @property
    type: string = ''

    // @property(cc.Node)
    // colorBlocksNode: cc.Node = null

    column: number = 0
    row: number = 0

    touched: boolean = false

    game: Game


    // @property(cc.Label)
    // label: cc.Label = null;

    // @property
    // text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}


    constructor(game: Game) {
        super()

        this.game = game
    }

    init(x: number, y: number): SimplelBlock {
        const { blockList, blocksGap, mapNode } = this.game

        const blockId = Math.round(Math.random() * (blockList.length - 1))

        this.node = cc.instantiate(blockList[blockId].node)

        this.type = blockList[blockId].type

        this.node.active = true

        this.column = x
        this.row = y

        this.node.x = (this.node.width + blocksGap) * x
        this.node.y = (this.node.height + blocksGap) * y

        mapNode.addChild(this.node)

        this.node.on(cc.Node.EventType.TOUCH_START, () => this.onTouch(true))

        return this
    }

    start() {


        // this.node.x

    }

    onTouch(isTrigger = false): number {
        const { map } = this.game
        const { column, row } = this

        // неочевидная проверка: если хоть раз прокнет touchSame, значит есть одинаковые блоки

        if(!isTrigger) {
            this.node.active = false
        }

        const strik = this.touchSame(column - 1, row)
            + this.touchSame(column + 1, row)
            + this.touchSame(column, row - 1)
            + this.touchSame(column, row + 1)


        if (isTrigger) {
            console.log(strik)
        }

        return strik
    }

    touchSame(x: number, y: number): number {
        const block = this.game.map[x]?.[y]

        if (block?.type === this.type && block.node.active) {
            return block.onTouch() + 1
        }

        return 0
    }



    public setRow(size: number): void {
        this.row = size
    }

    // update (dt) {}
}
