import Booster from "../Boosters/Booster";
import Game from "../Game/Game";
import MapController from "../Map/MapController";
import { selectAny } from "../Utils/utils";
import BombBlock from "./BombBlock";

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

export const BombTypes = [
    BlockTypes.BOMB,
    BlockTypes.BOMB_M,
    BlockTypes.RACKETS,
    BlockTypes.RACKETS_H
]

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
        const { animationDurability, longAnimationMultiplier } = this.game

        this.state = SimpleBlockState.SPAWN

        this.node.active = true

        this.column = x
        this.row = y

        this.node.width = blockSize
        this.node.height = blockSize

        this.node.x = (this.node.width + blocksGap) * x
        this.node.y = (this.node.height + blocksGap) * y

        this.node.scale = 0

        cc.tween(this.node)
            .delay(animationDurability)
            .to(animationDurability * longAnimationMultiplier, { scale: 1.1 })
            .to(animationDurability * (1 - longAnimationMultiplier), { scale: 1 })
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

        if (BombTypes.includes(this.type)) {
            this.getComponent(BombBlock).onTouch()

            return
        }

        if (this.booster) {
            this.booster.use(this)

            return
        }

        const chain = this.fireTouch()

        this.mapController.removeBlocks(chain)

        chain.forEach(block => block && (block.state = SimpleBlockState.IDLE))
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
        const { animationDurability, longAnimationMultiplier } = this.game

        return cc.tween(this.node)
            .to(animationDurability * (1 - longAnimationMultiplier), { scale: 1.1 })
            .to(animationDurability * longAnimationMultiplier, { scale: 0 })
            .call(() => {
                this.mapController.mapNode.removeChild(this.node)
            })
            .start()
    }

    move() {
        const { blocksGap, blockSize } = this.mapController
        const { animationDurability } = this.game

        cc.tween(this.node)
            .to(animationDurability, { position: cc.v3((blockSize + blocksGap) * this.column, (blockSize + blocksGap) * this.row) })
            .call(() => this.state = SimpleBlockState.IDLE)
            .start()
    }


    // update = (dt) => { }
}
