
export interface AnimationConfig {
    x?: number,
    y?: number,
    time?: number
    angle?: number
    target?: cc.Node
}

export default class Animation {
    static fall(node: cc.Node, config?: AnimationConfig) {
        console.log('fall')
    }

    static slide(node: cc.Node, config?: AnimationConfig) {

    }

    static spawn(node: cc.Node, config?: AnimationConfig) {

    }

    static play(sampleNode: cc.Node, config?: AnimationConfig) {
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

    static select(node: cc.Node, config?: AnimationConfig) {

    }

    static move(node: cc.Node, config?: AnimationConfig) {

    }

}
