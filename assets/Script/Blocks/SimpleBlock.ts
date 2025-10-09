import Game from "../Game/Game";
import MapController from "../Map/MapController";

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

    mapController: MapController

    column: number = 0
    row: number = 0
    state: SimpleBlockState = SimpleBlockState.NONE

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    spawn(mapController: MapController, x: number, y: number): SimplelBlock {
        this.mapController = mapController
        this.game = this.gameNode.getComponent(Game)

        const { blocksGap, blockSize } = mapController
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
            .call(() => {
                this.state = SimpleBlockState.IDLE
            })
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
        const block = this.mapController.mapData[x]?.[y]

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
                this.mapController.removeBlock(this)
            })
            .start()
    }

    get currentMapColumn() {
        return this.mapController?.mapData[this.column]
    }


    fallDown() {
        const { blocksGap } = this.mapController
        const { animationDurability, animationSpeed } = this.game

        const downBlock = this.currentMapColumn[this.row - 1]

        if (this.currentMapColumn && !downBlock && this.row) {
            const emptyRow = this.currentMapColumn.findIndex((block) => !block)

            if (emptyRow > -1) {
                this.currentMapColumn[emptyRow] = this

                this.currentMapColumn[this.row] = null

                this.row = emptyRow

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
