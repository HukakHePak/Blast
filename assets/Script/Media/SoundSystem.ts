import { selectAny } from "../Utils/utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SoundSystem extends cc.Component {
    @property
    duration: number = 1

    @property
    onceLimit: number = 1

    sounds: cc.AudioSource[]
    volumes: Map<cc.AudioSource, number> = null

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.sounds = this.node.getComponentsInChildren(cc.AudioSource)
        this.volumes = new Map(this.sounds.map(sound => [sound, sound.volume]))
    }

    start() {

    }

    getSound(name: string): cc.AudioSource {
        return this.sounds.find(sound => sound.node.name === name)
    }

    playSound(name: string) {
        this.getSound(name)?.play()
    }

    play() {
        const sound = selectAny(this.sounds)

        sound.volume = this.volumes.get(sound)

        sound.play()

        cc.tween(sound)
            .to(this.duration, { volume: 0.1 })
            .call(() => this.node.removeChild(sound.node))
            .start()
    }

    playParallel(count: number) {
        const sounds = this.sounds.sort(() => Math.random() > 0.5 ? 1 : -1).slice(0, count)

        sounds.forEach(sound => sound.play())
    }

    playChain(count: number, delay: number) {
        const sounds = this.sounds.sort(() => Math.random() > 0.5 ? 1 : -1).slice(0, count)

        this.schedule(() => {
            sounds.shift()?.play()
        }, delay, sounds.length - 1, 0)
    }

    // update (dt) {}
}
