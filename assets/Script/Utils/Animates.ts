
export interface AnimatesConfig {
    x?: number,
    y?: number,
    time?: number
    angle?: number
    target?: cc.Node
}

export default class Animates {
    static fall(node: cc.Node, config?: AnimatesConfig) {
        console.log('fall')
    }

    static slide(node: cc.Node, config?: AnimatesConfig) {

    }

    static spawn(node: cc.Node, config?: AnimatesConfig) {

    }

    static play(sampleNode: cc.Node, config?: AnimatesConfig) {
        const node = cc.instantiate(sampleNode)
        const parent = config?.target || sampleNode.parent

        parent.addChild(node)
        
        node.active = true

        node.x = config?.x ?? node.x
        node.y = config?.y ?? node.y
        node.angle = config?.angle ?? node.angle

        const animation = node.getComponent(cc.Animation)
        const sound = node.getComponent(cc.AudioSource)

        animation.play()
        sound.play()

        animation.on(cc.Animation.EventType.FINISHED, () => {
            parent.removeChild(node)
            
        })
    }

    static select(node: cc.Node, config?: AnimatesConfig) {

    }

    static move(node: cc.Node, config?: AnimatesConfig) {

    }

}
