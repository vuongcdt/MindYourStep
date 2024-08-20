import { _decorator, Component, EventMouse, Input, input, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    private _startJump: boolean = false;
    private _jumpStep: number = 0;
    private _curJumpTime: number = 0;
    private _jumpTime: number = 0.1;
    private _curJumpSpeed: number = 0;
    private _curPos: Vec3 = new Vec3();
    private _deltaPos: Vec3 = new Vec3(0, 0, 0);
    private _targetPos: Vec3 = new Vec3();


    start() {
        input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    }

    update(deltaTime: number) {
        if (!this._startJump) {
            return;
        }

        this._curJumpTime += deltaTime;
        if (this._curJumpTime > this._jumpTime) { // end of jump
            // end
            this.node.setPosition(this._targetPos); // force move to target position
            this._startJump = false; // mark the end of the jump
        } else { // jump in progress
            // tween
            this.node.getPosition(this._curPos); // Get the current position 
            this._deltaPos.x = this._curJumpSpeed * deltaTime; // calculate the length of this frame that should be displaced
            Vec3.add(this._curPos, this._curPos, this._deltaPos); // add the current position to the length of the displacement
            this.node.setPosition(this._curPos); // set the position after displacement
        }
    }
    onMouseUp(event: EventMouse) {
        if (event.getButton() === 0) {

        }
        else if (event.getButton() === 2) {

        }

    }

    jumpByStep(step: number) {
        if (this._startJump) {
            return;
        }
        this._startJump = true; // Whether to start to jump
        this._jumpStep = step; // Jump steps for this time
        this._curJumpTime = 0; // Reset the jump time
        this._curJumpSpeed = this._jumpStep / this._jumpTime; // Current jump step
        this.node.getPosition(this._curPos); // use 'getPosition` to get the current position of the character
        // target position = current position + steps
        Vec3.add(this._targetPos, this._curPos, new Vec3(this._jumpStep, 0, 0));
    }
}


