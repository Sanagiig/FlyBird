import {
  _decorator,
  Component,
  Input,
  input,
  instantiate,
  Node,
  Prefab,
  Size,
  v2,
  v3,
  view,
} from "cc";
import {BasicController} from "./BasicController";
const {ccclass, property} = _decorator;

@ccclass("BackgroundController")
export class BackgroundController extends Component implements BasicController {
  private worldSize: Size;
  private toggle = false;
  public vec = v2(-1, 0);
  public speed = 100;
  public isAlive = true;

  start() {
    this.worldSize = view.getDesignResolutionSize();
  }

  stop(): void {
      this.isAlive = false;
  }

  enable(): void {
    this.isAlive = true;
  }

  disable(): void {
    this.isAlive = false;
  }

  onTarch() {
    if (this.toggle) {
      this.node.setPosition(v3(0, 0, 0));
    } else {
      this.node.setPosition(v3(640, 0, 0));
    }
    this.toggle = !this.toggle;
  }

  update(deltaTime: number) {
    if(this.isAlive){
      const {width} = this.worldSize;
      const pos = this.node.getPosition();
      const offsetx = this.vec.x * this.speed * deltaTime;
      const offsety = this.vec.y * this.speed * deltaTime;
  
      if (pos.x <= -width) {
        pos.add3f(width, 0, 0);
      }
      this.node.setPosition(pos.add(v3(offsetx, offsety)));
    }
  }
}
