import { _decorator, Animation, Component, EventMouse, Input, input, Node, SkeletalAnimation, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {

    @property({ type: Animation })
    public BodyAnim: Animation | null = null;

    @property({ type: SkeletalAnimation })
    public CocosAnim: SkeletalAnimation | null = null;

    private _startJump: boolean = false;
    private _jumpStep: number = 0;
    private _curJumpTime: number = 0;
    private _jumpTime: number = 0.1;
    private _curJumpSpeed: number = 0;
    private _curPos: Vec3 = new Vec3();
    private _deltaPos: Vec3 = new Vec3(0, 0, 0);
    private _targetPos: Vec3 = new Vec3();
    private _curMoveIndex = 0;

    start() {
        input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        console.log("start");

    }

    update(deltaTime: number) {
        if (!this._startJump) {
            return;
        }

        this._curJumpTime += deltaTime;
        if (this._curJumpTime > this._jumpTime) {
            this.node.setPosition(this._targetPos);
            this._startJump = false;
            this.onOnceJumpEnd();
        } else {
            this.node.getPosition(this._curPos);
            this._deltaPos.x = this._curJumpSpeed * deltaTime;
            Vec3.add(this._curPos, this._curPos, this._deltaPos);
            this.node.setPosition(this._curPos);
        }
    }

    public onMouseUp(event: EventMouse) {
        if (event.getButton() === 0) {
            this.jumpByStep(1);
        }
        else if (event.getButton() === 2) {
            this.jumpByStep(2);
        }

    }


    // onOnceJumpEnd() {
    //     this.node.emit('JumpEnd', this._curMoveIndex);
    // }

    onOnceJumpEnd() {
        if (this.CocosAnim) {
            this.CocosAnim.play('cocos_anim_idle');
        }
        this.node.emit('JumpEnd', this._curMoveIndex);
    }

    setInputActive(active: boolean) {
        if (active) {
            input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        } else {
            input.off(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        }
    }

    // jumpByStep(step: number) {
    //     if (this._startJump) {
    //         return;
    //     }

    //     if (this.BodyAnim) {
    //         if (step === 1) {
    //             this.BodyAnim.play('onStep');

    //         } else if (step === 2) {
    //             this.BodyAnim.play('twoStep');
    //         }
    //     }
    //     this._curMoveIndex += step;

    //     this._startJump = true; // Whether to start to jump
    //     this._jumpStep = step; // Jump steps for this time
    //     this._curJumpTime = 0; // Reset the jump time
    //     this._curJumpSpeed = this._jumpStep / this._jumpTime; // Current jump step
    //     this.node.getPosition(this._curPos); // use 'getPosition` to get the current position of the character
    //     // target position = current position + steps
    //     Vec3.add(this._targetPos, this._curPos, new Vec3(this._jumpStep, 0, 0));
    // }

    jumpByStep(step: number) {
        if (this._startJump) {
            return;
        }
        this._startJump = true;
        this._jumpStep = step;
        this._curJumpTime = 0;
        this._curJumpSpeed = this._jumpStep / this._jumpTime;
        this.node.getPosition(this._curPos);
        Vec3.add(this._targetPos, this._curPos, new Vec3(this._jumpStep, 0, 0));

        if (this.CocosAnim) {
            var state = this.CocosAnim.getState('cocos_anim_jump');
            state.speed = state.duration / this._jumpTime;

            // this.CocosAnim.getState('cocos_anim_jump').speed = 3.5; 
            this.CocosAnim.play('cocos_anim_jump'); 
        }

        // if (this.BodyAnim) {
        //     if (step === 1) {
        //         this.BodyAnim.play('oneStep');
        //     } else if (step === 2) {
        //         this.BodyAnim.play('twoStep');
        //     }
        // }

        this._curMoveIndex += step;
    }

    reset() {
        this._curMoveIndex = 0;
    }

}


