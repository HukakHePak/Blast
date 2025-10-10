import SimplelBlock, { BlockTypes, BombTypes } from "../Blocks/SimpleBlock";
import Game from "../Game/Game";
import LevelController from "../Level/LevelController";
import { selectAny } from "../Utils/utils";

const { ccclass, property } = cc._decorator;

export enum MapControllerState {
    NONE = 'none',
    IDLE = 'idle',
    SPAWN = 'spawn',
    NEED = 'need_shake'
}

@ccclass
export default class MapController extends cc.Component {
    @property(cc.Integer)
    mapWidth: number = 8

    @property(cc.Integer)
    mapHeight: number = 9

    @property(cc.Integer)
    blockSize: number = 80

    @property(cc.Integer)
    blocksGap: number = 5

    @property(cc.Integer)
    minimalChainLength = 2

    @property(cc.Integer)
    bombSpawnChainLength = 5

    @property(cc.Integer)
    maxBombSpawnChainLength = 10

    @property(cc.Integer)
    bombRadius = 3

    @property(cc.Node)
    colorBlocksNode: cc.Node = null

    @property(cc.Node)
    bombsBlocksNode: cc.Node = null

    @property(cc.Node)
    mapNode: cc.Node = null

    @property(cc.Node)
    mapBackgroundNode: cc.Node = null


    @property(cc.Node)
    gameNode: cc.Node = null


    game: Game = null


    mapData: Array<Array<SimplelBlock>> = []; // TODO: а зачем, собсна, массив? Сделать Map

    blockList: Array<SimplelBlock> = []

    bombsList: Array<SimplelBlock> = []

    // state: MapControllerState = MapControllerState.NONE

    spawnCounter: number = 0

    // blockPool: cc.NodePool

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}



    start() { // TODO: spawn
        this.game = this.gameNode.getComponent(Game)
        this.blockList = this.colorBlocksNode.getComponentsInChildren(SimplelBlock)
        this.bombsList = this.bombsBlocksNode.getComponentsInChildren(SimplelBlock)

        this.init()
    }

    init() {
        const width = (this.mapWidth - 1) * (this.blockSize + this.blocksGap)
        const height = (this.mapHeight - 1) * (this.blockSize + this.blocksGap)

        this.mapNode.width = width
        this.mapNode.height = height

        this.mapBackgroundNode.width = width + (this.blockSize + this.blocksGap) * 2
        this.mapBackgroundNode.height = height + (this.blockSize + this.blocksGap) * 2

        // this.node.x = -width / 2
        // this.node.y = -height / 2


        for (let x = 0; x < this.mapWidth; x++) {
            const column = []

            for (let y = 0; y < this.mapHeight; y++) {
                column.push()

                this.spawnCounter += 1
            }

            this.mapData.push(column)
        }
    }

    clear() {
        this.mapData.forEach(column => {
            column.forEach((block, y) => {
                column[y].remove()
            })
        })
    }

    get hasMoves() {
        return this.mapData.some((column, x) => {
            return column.some((block, y) => {
                return block?.type === column[y + 1]?.type || block?.type === this.mapData[x + 1]?.[y].type
            })
        })
    }

    checkMapMoves() {
        this.spawnCounter -= 1

        if (!this.spawnCounter && !this.hasMoves) {
            this.game.levelController.shake()
            this.clear()
        }
    }

    createBlock(x: number, y: number, type?: BlockTypes) {
        const node = cc.instantiate(this.getBlockByType(type).node)

        this.mapNode.addChild(node)

        const block = node.getComponent(SimplelBlock)

        block.spawn(this, x, y, () => this.checkMapMoves())

        this.mapData[x][y] = block
    }

    getBlockByType(type?: BlockTypes) {
        if (type) {
            return this.bombsList.find(bomb => bomb.type === type) || this.blockList.find(bomb => bomb.type === type)
        }

        return selectAny(this.blockList)
    }

    replaceBlock(x: number, y: number, block: SimplelBlock) {
        if (this.mapData[x]?.[y]) {
            this.mapData[x][y] = block

            block.column = x
            block.row = y

            block.move()
        }
    }

    swapBlocks(target: SimplelBlock, source: SimplelBlock) {
        const { column, row } = source

        this.replaceBlock(target.column, target.row, source)
        this.replaceBlock(column, row, target)
    }

    removeBlocks(blocks: SimplelBlock[]) {

    }

    removeBlock(block: SimplelBlock) {
        const { node, column, row } = block

        this.spawnCounter += 1

        this.mapNode.removeChild(node)
        this.mapData[column][row] = null
    }

    getBlock(x: number, y: number) {
        return this.mapData[x]?.[y]
    }

    spawnNewBlocks() {
        this.mapData.forEach((column, x) => {
            const lastIndex = this.mapHeight - 1

            if (!column[lastIndex]) {
                this.createBlock(x, lastIndex)
            }
        })
    }

    update(dt) {
        this.spawnNewBlocks()
    }
}
