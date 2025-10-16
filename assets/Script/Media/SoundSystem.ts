import Animates from "../Utils/Animates";
import { selectAny } from "../Utils/utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SoundSystem extends cc.Component {
    // @property
    // duration: number = 1 //

    sounds: cc.AudioSource[]

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.sounds = this.node.getComponentsInChildren(cc.AudioSource)
    }

    start() {

    }

    play() {
        const lastSound = this.sounds.reduce((last, sound) => {
            sound.stop()

            return sound.isPlaying ? sound : last
        }, null)

        const nextSound = selectAny(this.sounds.filter(sound => sound !== lastSound))

        nextSound.play()

    }

    // update (dt) {}
}
