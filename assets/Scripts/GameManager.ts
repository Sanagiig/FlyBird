import {
  _decorator,
  Component,
  director,
  EventTouch,
  Label,
  Node,
  RichText,
  game,
} from "cc";
import {BirdController} from "./BirdController";
import {BackgroundController} from "./BackgroundController";
import {PipeController} from "./PipeController";
import {DialogController} from "./DialogController";
const {ccclass, property} = _decorator;

@ccclass("GameManager")
export class GameManager extends Component {
  @property({type: BirdController})
  private bird: BirdController = null;
  @property({type: BackgroundController})
  private background: BackgroundController = null;
  @property({type: PipeController})
  private pipe: PipeController = null;
  @property({type: DialogController})
  private dialog: DialogController;
  @property({type: Label})
  private score: Label = null;

  private scorePoint = 0;
  private isStop = false;

  start() {
    this.bird.node.on("collide", this.onCollide, this);
    this.schedule(() => {
      this.computing();
    }, 1);
  }

  onCollide() {
    this.bird.disable();
    this.background.disable();
    this.pipe.disable();
    this.gameOver();
    this.dialog.setPoint(this.scorePoint);
    this.dialog.open();
  }

  pauseOrResume(event: EventTouch) {
    if (this.isStop) {
      return;
    }

    const label = (event.target as Node)
      .getChildByName("Label")!
      .getComponent(Label);

    this.isStop = !this.isStop;
    if (director.isPaused()) {
      label.string = "Pause";
      director.resume();
    } else {
      label.string = "Resume";
      director.pause();
    }
  }

  restartGame() {
    director.loadScene("Game");
  }

  exitGame() {
    game.end();
  }

  gameOver() {
    this.isStop = true;
    this.showDialog();
  }

  computing() {
    if (!this.isStop) {
      this.refreshScore();
    }
  }

  refreshScore() {
    this.scorePoint++;
    this.score.string = `${this.scorePoint} Points`;
  }

  showDialog() {}

  update(deltaTime: number) {}
}
