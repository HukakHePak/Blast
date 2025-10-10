import SimplelBlock, { BlockTypes } from "../Blocks/SimpleBlock";
import Game from "../Game/Game";
import { selectAny } from "../Utils/utils";

const { ccclass, property } = cc._decorator;

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

    mapData: Array<Array<SimplelBlock>> = [];

    blockList: Array<SimplelBlock> = []

    bombsList: Array<SimplelBlock> = []

    spawnCounter: number = 0

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}



    start() {
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

        this.mapData = Array.from({ length: this.mapWidth }).map(() => Array.from({ length: this.mapHeight }))

        this.fillMap()
    }

    fillMap() {
        this.mapData.forEach((c, x) => {
            c.forEach((block, y) => {
                if (block) return

                this.createBlock(x, y)
            })
        })

        if (this.hasMoves) return


        this.clear()
        this.game.levelController.shake()
    }

    createBlock(x: number, y: number, type?: BlockTypes) {
        const node = cc.instantiate(this.getBlockByType(type).node)

        this.mapNode.addChild(node)

        const block = node.getComponent(SimplelBlock)

        block.spawn(this, x, y)

        this.mapData[x][y] = block
    }

    clear() {
        this.mapData.forEach(column => {
            column.forEach((block, y) => {
                this.removeBlock(block)
            })
        })

        this.fillMap()
    }

    get hasMoves() {
        return this.mapData.some((column, x) => {
            return column.some((block, y) => {
                return block?.type >= BlockTypes.BOMB || block?.type === column[y + 1]?.type || block?.type === this.mapData[x + 1]?.[y].type
            })
        })
    }

    getBlockByType(type?: BlockTypes) {
        if (type) {
            return this.bombsList.find(bomb => bomb.type === type) || this.blockList.find(bomb => bomb.type === type)
        }

        return selectAny(this.blockList)
    }

    replaceBlock(x: number, y: number, block: SimplelBlock | null) {
        if (this.mapData[x]?.[y]) {
            this.mapData[x][y] = block

            if (!block) {
                return
            }

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
        blocks.forEach(block => this.removeBlock(block))

        this.scheduleOnce(() => {
            this.fallMap()
        }, this.game.animationDurability)
    }

    fallMap() {
        this.mapData = this.mapData.map((column, x) => {
            const fallen = Array.from({ length: this.mapHeight }) as SimplelBlock[]

            column.filter(block => block).forEach((block, y) => {
                block.column = x
                block.row = y

                block.move()

                fallen[y] = block
            })

            return fallen
        })

        this.fillMap()
    }

    removeBlock(block: SimplelBlock) {
        if (!block) return

        const { column, row } = block
        block.remove()

        this.mapData[column][row] = null
    }

    getBlock(x: number, y: number) {
        return this.mapData[x]?.[y]
    }

    // update(dt) { }
}
