import { selectBetween } from "../Utils/utils";
const { ccclass } = cc._decorator;

@ccclass
export default class CustomFly extends cc.Component {
    gravity: number = 9.8

    angle: number = Math.PI / 4

    speed: number = 100

    x: number

    y: number

    time: number = 0

    isFalling: boolean = false

    duration: number = 40

    // onLoad() { }

    start() {
        this.x = this.node.x
        this.y = this.node.y

        this.angle = selectBetween(0, Math.PI)
        this.speed = selectBetween(this.speed / 2, this.speed)
    }

    fall() {
        this.isFalling = true
    }

    update(dt: number) {
        if (!this.isFalling) return

        this.time += dt * this.duration

        this.node.x = this.x + this.speed * this.time * Math.cos(this.angle)
        this.node.y = this.y + this.speed * this.time * Math.sin(this.angle) - 1 / 2 * this.gravity * Math.pow(this.time, 2)
    }
}
