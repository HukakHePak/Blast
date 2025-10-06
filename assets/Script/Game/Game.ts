import SimplelBlock from "../Blocks/SimpleBlock";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {
    @property(cc.Integer)
    mapWidth: number = 8

    @property(cc.Integer)
    mapHeight: number = 9

    @property(cc.Integer)
    blockSize: number = 40

    @property(cc.Integer)
    blocksGap: number = 5

    @property(cc.Integer)
    animationSpeed = 1

    @property(cc.Integer)
    minimalChainLength = 1      // TODO: чтоб работало, нужно поменять алгоритм сжигания

    @property(cc.Node)
    colorBlocksNode: cc.Node = null

    @property(cc.Node)
    mapNode: cc.Node = null

    @property(cc.Node)
    mapBackgroundNode: cc.Node = null

    @property(cc.Node)
    scoresNode: cc.Node = null

    map: Array<Array<SimplelBlock>> = [];

    blockList: Array<SimplelBlock> = []

    // blockPool: cc.NodePool

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}



    start() { // TODO: spawn
        const width = (this.mapWidth - 1) * (this.blockSize + this.blocksGap)
        const height = (this.mapHeight - 1) * (this.blockSize + this.blocksGap)

        this.mapNode.width = width
        this.mapNode.height = height

        this.mapBackgroundNode.width = width + (this.blockSize + this.blocksGap) * 2
        this.mapBackgroundNode.height = height + (this.blockSize + this.blocksGap) * 2

        // this.node.x = -width / 2
        // this.node.y = -height / 2

        this.blockList = this.colorBlocksNode.getComponentsInChildren(SimplelBlock)

        this.fillMap()
    }

    fillMap() {
        for (let x = 0; x < this.mapWidth; x++) {
            const column = []

            // const spawnRow = this.mapHeight + 1

            for (let y = 0; y < this.mapHeight; y++) {
                column.push(this.createBlock(x, y))
            }

            this.map.push(column)
        }
    }

    createBlock(x: number, y: number): SimplelBlock {
        const { blockList } = this

        const blockId = Math.round(Math.random() * (blockList.length - 1))

        const node = cc.instantiate(blockList[blockId].node)

        const block = node.getComponent(SimplelBlock)

        block.spawn(this, x, y)

        return block
    }

    // private onFallBlockClick

    update(dt) {
        this.map.forEach((column, x) => {
            const lastIndex = this.mapHeight - 1

            if (!column[lastIndex]) {
                column[lastIndex] = this.createBlock(x, lastIndex)
            }
        })
        // console.log('fire')
    }
}
