import {_decorator, Component, Node, RichText,Animation} from "cc";
const {ccclass, property} = _decorator;

@ccclass("DialogController")
export class DialogController extends Component {
  private dialog:Node = null;
  protected onLoad(): void {
   
  }
  start() {}
  
  open(){
    this.node.getComponent(Animation).play("DialogOpen");
  }

  close(){
    this.node.getComponent(Animation).play("DialogClose");
  }

  hide(){

  }
  setPoint(point: number) {
    const rich = this.node.getChildByName("Content").getComponent(RichText);
    rich.string = `<size=50><b>Game over</b></size><br/><img src="bird0_0" height=40/><size=40>Got </size><br/><color=#C3ff00 >${point} Points</color>`;
  }
  update(deltaTime: number) {}
}
