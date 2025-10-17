import SoundSystem from "./SoundSystem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Media extends cc.Component {

    // @property(cc.Label)
    // label: cc.Label = null;

    // @property
    // text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    @property(cc.Node)
    lux: cc.Node = null;

    @property(cc.Node)
    megumin: cc.Node = null

    @property(cc.Node)
    explosion: cc.Node = null

    @property(cc.Node)
    mcExplosion: cc.Node = null

    @property(cc.Node)
    screamsNode: cc.Node = null

    @property(cc.Node)
    soundsNode: cc.Node = null

    @property(cc.Node)
    mainThemeNode: cc.Node = null

    screams: SoundSystem
    sounds: SoundSystem
    mainTheme: SoundSystem

    // @property(cc.Node)
    // lux: cc.Node = null;

    onLoad () {
        this.screams = this.screamsNode.getComponent(SoundSystem)
        this.sounds = this.soundsNode.getComponent(SoundSystem)
        this.mainTheme = this.mainThemeNode.getComponent(SoundSystem)
    }

    start() {

    }

    // update (dt) {}
}
