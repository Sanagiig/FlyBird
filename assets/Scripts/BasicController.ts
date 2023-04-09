import {_decorator, Component} from "cc";
const {ccclass, property} = _decorator;


export interface BasicController {
  isAlive: boolean;
  speed?: number;

  // stop():void;
  enable(): void;
  disable(): void;
}
