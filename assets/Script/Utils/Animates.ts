export interface AnimatesConfig {
    x?: number,
    y?: number,
    duration?: number
    angle?: number
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

        node.zIndex +=1

        node.x = config?.x ?? node.x
        node.y = config?.y ?? node.y
        node.angle = config?.angle ?? node.angle

        const animation = node.getComponent(cc.Animation)
        const sound = node.getComponent(cc.AudioSource)

        animation?.play()
        sound?.play()

        if (parent) {
            animation.on(cc.Animation.EventType.FINISHED, () => {
                parent.removeChild(node)
            })
        }
    }

    despawn(node: cc.Node, config?: AnimatesConfig) {

    }

    static select(node: cc.Node, config?: AnimatesConfig) {

    }

    static move(node: cc.Node, config?: AnimatesConfig) {

    }
}
