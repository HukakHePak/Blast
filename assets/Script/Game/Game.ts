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
    
    @property(cc.Node)
    colorBlocksNode: cc.Node = null

    @property(cc.Node)
    mapNode: cc.Node = null
    
    map: Array<Array<SimplelBlock>> = [];

    blockList: Array<SimplelBlock> = []

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    

    start() {
        const width = this.mapWidth * (this.blockSize + this.blocksGap) - this.blocksGap
        const height = this.mapHeight * (this.blockSize + this.blocksGap) - this.blocksGap

        this.mapNode.width = width
        this.mapNode.height = height


        // this.node.x = -width / 2
        // this.node.y = -height / 2

        this.blockList = this.colorBlocksNode.getComponentsInChildren(SimplelBlock)

        for (let i = 0; i < this.mapWidth; i++) {
            const row = []

            for (let j = 0; j < this.mapHeight; j++) {
                const block = new SimplelBlock(this)
                
                block.init(i, j)

                row.push(block)
            }

            this.map.push(row)
        }
    }

    // private onFallBlockClick

    // update (dt) {}
}
