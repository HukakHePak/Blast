import Animates from "../Utils/Animates";
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

    play() {
        // const startedSounds = this.sounds.filter(sound => sound.isPlaying)



        // const nextSound = selectAny(this.sounds.filter(sound => sound !== lastSound))

        // nextSound.play()

        const sound = selectAny(this.sounds)
        // // const sample = selectAny(this.sounds)
        // const copy = cc.instantiate(sound.node)

        // this.node.addChild(copy)
        // sound.stop()
        sound.play()

        cc.tween(sound)
            .by(0, { volume: this.volumes.get(sound)})
            .to(this.duration, { volume: 0.1 })
            .call(() => this.node.removeChild(sound.node))
            .start()
    }

    // update (dt) {}
}
