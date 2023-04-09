import {
  _decorator,
  Component,
  Node,
  Animation,
  input,
  Input,
  EventTouch,
  RigidBody2D,
  v2,
  v3,
  Vec3,
  math,
  view,
} from "cc";
import {BasicController} from "./BasicController";
import {Collider2D} from "cc";
import {Contact2DType} from "cc";
import {IPhysics2DContact} from "cc";
const {ccclass, property} = _decorator;

@ccclass("BirdController")
export class BirdController extends Component implements BasicController {
  private flyAnim: Animation;
  private collider: Collider2D;
  private rbody: RigidBody2D;

  public isAlive = true;
  private maxZAng = 30;
  init() {
    this.collider = this.getComponent(Collider2D);
    this.rbody = this.getComponent(RigidBody2D);
    this.flyAnim = this.getComponent(Animation);

    this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginConcat, this);
    input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
  }
  enable() {
    this.init();
  }
  disable() {
    this.flyAnim.stop();
    this.collider.off(Contact2DType.BEGIN_CONTACT);
    input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
    this.isAlive = false;
  }
  onLoad(): void {
    this.init();
  }
  start() {}
  stop(): void {
    this.isAlive = false;
    this.rbody;
  }
  isFlyOver(pos: Vec3) {
    const {height} = view.getDesignResolutionSize();
    return pos.y > height / 2 - 50;
  }
  onBeginConcat(
    self: Collider2D,
    other: Collider2D,
    contact: IPhysics2DContact,
  ) {
    this.node.emit("collide");
    this.rbody.applyLinearImpulseToCenter(v2(20, -20), true);
    contact.setRestitution(2);
  }
  onTouchStart(event: EventTouch) {
    if (this.isFlyOver(this.node.getPosition())) {
      return;
    }

    const rotation = this.node.rotation;
    const v = v3(0, 0, 0);
    math.Quat.toEuler(v, rotation);

    if (v.z < this.maxZAng) {
      this.rbody.applyAngularImpulse(5, true);
    }
    this.rbody.applyForceToCenter(v2(0, 1200), true);
  }
  keepBalance(ratial: number) {
    const quat = this.node.getRotation();
    const pos = this.node.getPosition();
    const v = v3(0, 0, 0);
    math.Quat.toEuler(v, quat);

    if (v.z > this.maxZAng) {
      this.node.setRotationFromEuler(v3(0, 0, this.maxZAng));
    } else {
      quat.x -= quat.x * ratial;
      quat.y -= quat.y * ratial;
      quat.z -= quat.z * ratial;
      quat.w -= quat.w * ratial;
      this.node.setRotation(quat);
    }

    if (this.isFlyOver(pos)) {
      this.rbody.applyForceToCenter(v2(0, -50), true);
    }
    this.node.setPosition(v3((1 - ratial) * pos.x, pos.y, pos.z));
  }
  update(deltaTime: number) {
    if (this.isAlive) {
      this.keepBalance(deltaTime);
    }
  }
}
