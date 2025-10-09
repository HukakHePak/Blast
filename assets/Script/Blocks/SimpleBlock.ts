import Game from "../Game/Game";
import LevelMap from "../Level/LevelMap";

const { ccclass, property } = cc._decorator;

export enum SimpleBlockState {
    NONE = 'none',
    IDLE = 'idle',
    FALL = 'fall',
    SPAWN = 'spawn',
    TOUCHED = 'touched',
}

@ccclass
export default class SimplelBlock extends cc.Component {
    @property
    type: string = ''

    @property(cc.Node)
    gameNode: cc.Node = null

    game: Game

    levelMap: LevelMap

    // @property()


    // @property(cc.Node)
    // colorBlocksNode: cc.Node = null

    column: number = 0
    row: number = 0
    state: SimpleBlockState = SimpleBlockState.NONE

    // scores: Scores = null
    // steps: Steps = null



    // @property(cc.Label)
    // label: cc.Label = null;

    // @property
    // text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}



    spawn(levelMap: LevelMap, x: number, y: number): SimplelBlock {
        this.levelMap = levelMap
        this.game = this.gameNode.getComponent(Game)

        const { blocksGap, blockSize } = levelMap
        const { animationDurability, animationSpeed, longAnimationMultiplier } = this.game

        this.state = SimpleBlockState.SPAWN

        this.node.active = true

        this.column = x
        this.row = y

        this.node.width = blockSize
        this.node.height = blockSize

        this.node.x = (this.node.width + blocksGap) * x
        this.node.y = (this.node.height + blocksGap) * y

        this.node.scale = 0

        cc.tween(this.node) // TODO: Animations.ts
            .delay(animationDurability / animationSpeed)
            .to(animationDurability * longAnimationMultiplier / animationSpeed, { scale: 1.1 })
            .to(animationDurability * (1 - longAnimationMultiplier) / animationSpeed, { scale: 1 })
            .call(() => this.state = SimpleBlockState.IDLE)
            .start()

        this.node.on(cc.Node.EventType.TOUCH_START, () => this.onTouch(true))

        return this
    }

    start() { }

    onTouch(isTrigger = false): number {
        const { column, row } = this


        if (!isTrigger) {
            this.state = SimpleBlockState.TOUCHED
            this.remove()
        }

        const chainLength = this.touchSame(column - 1, row)
            + this.touchSame(column + 1, row)
            + this.touchSame(column, row - 1)
            + this.touchSame(column, row + 1)

        // неочевидная проверка: если хоть раз прокнет touchSame, значит есть одинаковые блоки

        if (isTrigger && chainLength) {
            this.remove()

            this.game.levelController.fire(chainLength)
        }

        return chainLength
    }

    touchSame(x: number, y: number): number {
        const block = this.levelMap.mapData[x]?.[y]

        if (block?.type === this.type && block.state !== SimpleBlockState.TOUCHED) {
            return block.onTouch() + 1
        }

        return 0
    }

    remove() {
        const { animationDurability, animationSpeed, longAnimationMultiplier } = this.game

        cc.tween(this.node) // TODO: make animation clip
            .to(animationDurability * (1 - longAnimationMultiplier) / animationSpeed, { scale: 1.1 })
            .to(animationDurability * longAnimationMultiplier / animationSpeed, { scale: 0 })
            .call(() => {
                this.levelMap.removeBlock(this)
            })
            .start()
    }

    get currentMapColumn() {
        return this.levelMap?.mapData[this.column]
    }


    fallDown() {
        const { blocksGap, mapNode, blockSize } = this.levelMap
        const { animationDurability, animationSpeed, longAnimationMultiplier } = this.game

        // console.log(this.game)
        const downBlock = this.currentMapColumn[this.row - 1]

        if (this.currentMapColumn && !downBlock && this.row) {
            const emptyRow = this.currentMapColumn.findIndex((block) => !block)

            if (emptyRow > -1) {
                this.currentMapColumn[emptyRow] = this

                this.currentMapColumn[this.row] = null

                this.row = emptyRow


                // this.node.y = (this.node.height + this.game.blocksGap) * emptyRow

                this.state = SimpleBlockState.FALL

                cc.tween(this.node)
                    .to(animationDurability / animationSpeed, { position: cc.v3(this.node.x, (this.node.height + blocksGap) * emptyRow) })
                    .call(() => this.state = SimpleBlockState.IDLE)
                    .start()

            }
        }
    }

    update = (dt) => {
        if (this.node.active) {
            this.fallDown()
        }
    }
}
