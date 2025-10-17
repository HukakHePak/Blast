export interface AnimatesConfig {
    x?: number,
    y?: number,
    duration?: number
    angle?: number
    scaleX?: number
    target?: cc.Node
}

export default class Animates {
    static slide(node: cc.Node, config?: AnimatesConfig) {

    }

    static spawn(node: cc.Node, config?: AnimatesConfig) {

    }

    static play(sampleNode: cc.Node, config?: AnimatesConfig) {
        let node = sampleNode
        const parent = config?.target

        if (parent) {
            node = cc.instantiate(sampleNode)
            parent.addChild(node)
        }


        node.active = true

        node.zIndex +=10

        node.x = config?.x ?? node.x
        node.y = config?.y ?? node.y
        node.angle = config?.angle ?? node.angle

        node.scaleX = config?.scaleX ?? node.scaleX

        const animation = node.getComponent(cc.Animation)
        const sound = node.getComponent(cc.AudioSource)

        animation?.play()
        sound?.play()

        animation?.on(cc.Animation.EventType.FINISHED, () => {
            if (parent) {
                parent.removeChild(node)
            }

            node.zIndex = 0
        })
    }

    despawn(node: cc.Node, config?: AnimatesConfig) {

    }

    static select(node: cc.Node, config?: AnimatesConfig) {

    }

    static move(node: cc.Node, config?: AnimatesConfig) {

    }
}
