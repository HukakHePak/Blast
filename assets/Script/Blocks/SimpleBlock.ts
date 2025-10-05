import Game from "../Game/Game";

const { ccclass, property } = cc._decorator;

// export const BOX_TYPE = cc.Enum({
//     BLUE: 0,
//     RED: 1
// })



export enum SimpleBlockState {
    NONE = 'none',
    IDLE = 'idle',
    FALL = 'fall',
    SPAWN = 'spawn',
    TOUCHED = 'touched',
}

@ccclass
export default class SimplelBlock extends cc.Component {
    // color: string = 'blue'


    @property
    type: string = ''

    @property(cc.Integer)

    animationDurability = 0.5
    longAnimationMultiplier = 0.8


    // @property(cc.Node)
    // colorBlocksNode: cc.Node = null

    column: number = 0
    row: number = 0
    state: SimpleBlockState = SimpleBlockState.NONE



    game: Game


    // @property(cc.Label)
    // label: cc.Label = null;

    // @property
    // text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}



    init(game: Game, x: number, y: number): SimplelBlock {
        this.game = game

        const { blockList, blocksGap, mapNode } = this.game

        // const blockId = Math.round(Math.random() * (blockList.length - 1))

        // this.node = cc.instantiate(blockList[blockId].node)

        // this.type = blockList[blockId].type

        this.state = SimpleBlockState.SPAWN

        this.node.active = true

        this.column = x
        this.row = y

        this.node.x = (this.node.width + blocksGap) * x
        this.node.y = (this.node.height + blocksGap) * y

        this.node.scale = 0

        mapNode.addChild(this.node)

        cc.tween(this.node) // TODO: Animations.ts
            .delay(this.animationDurability / this.game.animationSpeed)
            .to(this.animationDurability * this.longAnimationMultiplier / this.game.animationSpeed, { scale: 1.1 })
            .to(this.animationDurability * (1 - this.longAnimationMultiplier) / this.game.animationSpeed, { scale: 1 })
            .call(() => this.state = SimpleBlockState.IDLE)
            .start()

        // this.map

        this.node.on(cc.Node.EventType.TOUCH_START, () => this.onTouch(true))

        return this
    }

    start = () => {
        // console.log('start block', this.game)

        // this.node.x

    }

    onTouch(isTrigger = false): number {
        const { column, row } = this


        if (!isTrigger) {
            this.state = SimpleBlockState.TOUCHED
            this.remove()
        }

        const strik = this.touchSame(column - 1, row)
            + this.touchSame(column + 1, row)
            + this.touchSame(column, row - 1)
            + this.touchSame(column, row + 1)

        // неочевидная проверка: если хоть раз прокнет touchSame, значит есть одинаковые блоки

        if (isTrigger && strik) {
            this.remove()
            console.log({ strik: strik + 1, touched: this.state })
        }

        return strik
    }

    touchSame(x: number, y: number): number {
        const block = this.game.map[x]?.[y]

        if (block?.type === this.type && block.state !== SimpleBlockState.TOUCHED) {
            return block.onTouch() + 1
        }

        return 0
    }

    remove() {
        cc.tween(this.node) // TODO: make animation clip
            .to(this.animationDurability * (1 - this.longAnimationMultiplier) / this.game.animationSpeed, { scale: 1.1 })
            .to(this.animationDurability * this.longAnimationMultiplier / this.game.animationSpeed, { scale: 0 })
            .call(() => {
                this.game.mapNode.removeChild(this.node)
                this.game.map[this.column][this.row] = null
            })
            .start()
    }

    get downBlock() {
        return this.game?.map[this.column][this.row - 1]
    }

    set downBlock(block: SimplelBlock) {
        this.game.map[this.column][this.row - 1] = block
    }

    get currentMapColumn() {
        return this.game?.map[this.column]
    }


    public setRow(size: number): void {
        this.row = size
    }

    fallDown() {
        // console.log(this.game)
        const downBlock = this.currentMapColumn[this.row - 1]

        if (this.game && !downBlock && this.row) {
            const emptyRow = this.currentMapColumn.findIndex((block) => !block)

            if (emptyRow > -1) {
                this.currentMapColumn[emptyRow] = this

                this.currentMapColumn[this.row] = null

                this.row = emptyRow


                // this.node.y = (this.node.height + this.game.blocksGap) * emptyRow

                this.state = SimpleBlockState.FALL

                cc.tween(this.node)
                    .to(this.animationDurability / this.game.animationSpeed, { position: cc.v3(this.node.x, (this.node.height + this.game.blocksGap) * emptyRow) })
                    .call(() => this.state = SimpleBlockState.IDLE)
                    .start()

            }
            // console.log(emptyIndex)

            // console.log('fire have game')
        }
    }

    update = (dt) => {
        // console.log(this)

        if (this.node.active) {
            this.fallDown()
        }

        // this.fallDown()
        // console.log(this.game && !this.downBlock)

        // this.node.active = false

        // if (this.game) {
        //     console.log('fire')
        // }

        // if (this.game && !this.downBlock) {
        //     // TODO: поиск ячейки для падения

        //     const emptyRow = this.game.map.indexOf(null)

        //     console.log(emptyRow)

        //     this.game.map[this.column][this.row] = null

        //     this.downBlock = this
        // }
    }
}
