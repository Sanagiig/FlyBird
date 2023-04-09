import {
  _decorator,
  Component,
  Node,
  Prefab,
  instantiate,
  view,
  v3,
  Size,
  CCInteger,
  Vec3,
} from "cc";
import {BasicController} from "./BasicController";
const {ccclass, property} = _decorator;

enum PipeType {
  UP = "up",
  DOWN = "down",
}

@ccclass("PipeController")
export class PipeController extends Component implements BasicController {
  @property({type: Prefab})
  private pipeUp: Prefab;

  @property({type: Prefab})
  private pipeDown: Prefab;

  private isTest = false;
  private interval = 2;

  public activePipeMap: Record<PipeType, Node[]> = {} as any;
  public sleepPipeMap: Record<PipeType, Node[]> = {} as any;
  public pipeOrgPos: Record<PipeType, Vec3> = {} as any;

  public pipeUpList: Node[] = [];
  public pipeDownList: Node[] = [];

  public disablePipeUpList: Node[] = [];
  public disablePipeDownList: Node[] = [];
  private worldSize: Size;
  private maxOffsetY = 40;
  public speed = 100;
  public isAlive = true;

  init() {
    this.activePipeMap.up = [];
    this.activePipeMap.down = [];
    this.sleepPipeMap.up = [];
    this.sleepPipeMap.down = [];
    this.worldSize = view.getDesignResolutionSize();
  }

  start() {
    this.init();
    this.schedule(() => {
      if (this.isAlive) {
        this.setupPipes();
      }
    }, this.interval);
  }

  enable() {
    this.isAlive = true;
  }

  disable() {
    this.isAlive = false;
  }

  onDestroy() {
    this.unscheduleAllCallbacks();
  }

  genOffset() {
    const randNum = this.maxOffsetY * Math.random();
    return Math.random() > 0.5 ? randNum : -randNum;
  }

  genPipe(type: PipeType) {
    const activeList = this.activePipeMap[type];
    const sleepList = this.sleepPipeMap[type];
    let orginPos = this.pipeOrgPos[type];
    let node: Node;

    if (sleepList.length) {
      node = sleepList.shift();
      node.setPosition(orginPos.clone().add3f(0, this.genOffset(), 0));
    }

    if (!node) {
      node = instantiate(type === PipeType.UP ? this.pipeUp : this.pipeDown);

      this.node.addChild(node);

      if (!orginPos) {
        orginPos = this.pipeOrgPos[type] = node.getPosition();
      }

      node.setPosition(orginPos.clone().add(v3(0, this.genOffset(), 0)));
    }

    activeList.push(node);
    return node;
  }

  genDoublePipe() {
    this.genPipe(PipeType.UP);
    this.genPipe(PipeType.DOWN);
  }

  setupPipes() {
    const seed = Math.floor(Math.random() * 4);

    if(seed < 0.15){
      this.genPipe(PipeType.UP);
    }else if(seed < 0.3){
      this.genPipe(PipeType.DOWN);
    }else{
      this.genDoublePipe();
    }
  }

  updatePipe<T extends Node>(
    activeList: T[],
    sleepList: T[],
    i: number,
    dt: number,
  ) {
    const {width} = this.worldSize;
    const pipe = activeList[i];
    const pos = pipe.position;
    const offsetX = -this.speed * dt;

    if (pipe.position.x < -200 - width) {
      activeList.splice(i, 1);
      sleepList.push(pipe);
      return;
    }

    pipe.setPosition(pos.add3f(offsetX, 0, 0));
  }

  updatePipeStatus(deltaTime: number) {
    const upList = this.activePipeMap.up;
    const downList = this.activePipeMap.down;
    const sleepUpList = this.sleepPipeMap.up;
    const sleepDownList = this.sleepPipeMap.down;

    for (let i = upList.length - 1; i >= 0; i--) {
      this.updatePipe(upList, sleepUpList, i, deltaTime);
    }

    for (let i = downList.length - 1; i >= 0; i--) {
      this.updatePipe(downList, sleepDownList, i, deltaTime);
    }
  }

  update(deltaTime: number) {
    if (this.isAlive) {
      this.updatePipeStatus(deltaTime);
    }
  }
}
