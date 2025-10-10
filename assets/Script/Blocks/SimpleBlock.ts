import Booster from "../Boosters/Booster";
import Game from "../Game/Game";
import MapController from "../Map/MapController";

const { ccclass, property } = cc._decorator;

export enum BlockTypes {
    NONE = 0,
    RED = 1,
    GREEN = 2,
    BLUE = 3,
    PURPLE = 4,
    YELLOW = 5,
    BOMB = 6,
    BOMB_M = 7,
    RACKETS = 8,
    RACKETS_H = 9
}

export enum SimpleBlockState {
    NONE = 'none',
    IDLE = 'idle',
    FALL = 'fall',
    SPAWN = 'spawn',
    TOUCHED = 'touched',
}

@ccclass
export default class SimplelBlock extends cc.Component {
    @property({ type: cc.Enum(BlockTypes) })
    type: BlockTypes = BlockTypes.NONE

    @property(cc.Node)
    gameNode: cc.Node = null

    game: Game

    mapController: MapController

    column: number = 0
    row: number = 0
    state: SimpleBlockState = SimpleBlockState.NONE

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    spawn(mapController: MapController, x: number, y: number, callback?: () => void): SimplelBlock {
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
                callback?.()
            })
            .start()

        this.node.on(cc.Node.EventType.TOUCH_START, () => this.onTouch())

        return this
    }

    start() { }

    get booster(): Booster {
        return this.game.levelController.boostersController.active
    }

    onTouch() {
        if (this.state !== SimpleBlockState.IDLE) {
            return
        }

        if (this.booster) {
            this.booster.use(this)

            return
        }

        const chain = this.fireTouch()

        if (chain.length >= this.mapController.minimalChainLength) {
            
            chain.forEach(block => block.remove())
            console.log('remove')
            
            if(chain.length >= this.mapController.bombSpawnChainLength) {
                // this.remove()
                console.log('spawn bomb')
                this.mapController.createBomb(this.column, this.row)




                // this.mapController.
            }
            // this.remove()

            
            this.game.levelController.fire(chain.length)

            return
        }

        chain.forEach(block => block.state = SimpleBlockState.IDLE)
    }

    fireTouch(): Array<SimplelBlock> {
        const { column, row } = this

        this.state = SimpleBlockState.TOUCHED

        return [
            this,
            ...this.touchSame(column - 1, row),
            ...this.touchSame(column + 1, row),
            ...this.touchSame(column, row - 1),
            ...this.touchSame(column, row + 1)
        ]
    }

    touchSame(x: number, y: number): Array<SimplelBlock> {
        const block = this.mapController.getBlock(x, y)

        if (block?.type === this.type && block.state !== SimpleBlockState.TOUCHED) {
            return [...block.fireTouch()]
        }

        return []
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

    move() {
        const { blocksGap, blockSize } = this.mapController
        const { animationDurability, animationSpeed } = this.game

        cc.tween(this.node)
            .to(animationDurability / animationSpeed, { position: cc.v3((blockSize + blocksGap) * this.column, (blockSize + blocksGap) * this.row) })
            .call(() => this.state = SimpleBlockState.IDLE)
            .start()
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
            console.log('fall')
            this.fallDown()
        }
    }
}
