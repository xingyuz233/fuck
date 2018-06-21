import * as THREE from "three";

//人物操作
const KEY_W = 87;
const KEY_S = 83;
const KEY_A = 65;
const KEY_D = 68;
const KEY_SHIFT = 16;

const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_LEFT = 37;
const KEY_RIGHT = 39;

const KEY_SPACE = 32;

const KEY_M = 77;

//游戏功能
const KEY_ESC = 27;

//基本游戏参数
const RUN_SPEED = 40;
const WALK_SPEED = 30;
const JUMP_SPEED = 30;
const CLIMB_SPEED = 10;
const CROUCH_SPEED = 5;
const GRAVITATION_ACCELERATION = 100;

import { Player } from "../role/player";
export class KeyController {

    constructor(player, scene) {

        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.ySpeed = 0;
        this.jump = false;
        this.inAir = false;
        //this.object = player.model;
        this.scene = scene;

        this.player = player;
        this.status = player.status;
        this.bind();
        this.setSelfView();
    }


    onKeyDown(event) {

        switch (event.keyCode) {

            case KEY_UP: /*up*/
            case KEY_W: /*W*/
                this.moveForward = true;
                break;

            case KEY_LEFT: /*left*/
            case KEY_A: /*A*/
                this.moveLeft = true;
                break;

            case KEY_DOWN: /*down*/
            case KEY_S: /*S*/
                this.moveBackward = true;
                break;

            case KEY_RIGHT: /*right*/
            case KEY_D: /*D*/
                this.moveRight = true;
                break;
            /*
                        case 82: //R
                            this.moveUp = true;
                            break;
                        case 70: //F
                            this.moveDown = true;
                            break;
            */
            case KEY_SHIFT: /*SHIFT*/
                this.run = true;
                break;

            case KEY_SPACE:
                if (!this.inAir && !this.jump) {
                    this.jump = true;
                }
                break;

            case KEY_M:
                this.player.socket.emit('buyRifle', {
                    'socketid': this.player.socket.id,
                    'rifle': 'm4a1'
                });
                break;
        }

    }

    onKeyUp(event) {

        switch (event.keyCode) {

            case KEY_UP: /*up*/
            case KEY_W: /*W*/
                this.moveForward = false;
                break;

            case KEY_LEFT: /*left*/
            case KEY_A: /*A*/
                this.moveLeft = false;
                break;

            case KEY_DOWN: /*down*/
            case KEY_S: /*S*/
                this.moveBackward = false;
                break;

            case KEY_RIGHT: /*right*/
            case KEY_D: /*D*/
                this.moveRight = false;
                break;
            /*
            case 82: //R
                this.moveUp = true;
                break;

                case 70: //F
                    this.moveDown = true;
                    break;
                    */

            case KEY_SHIFT: /*SHIFT*/
                this.run = false;
                break;


        }

    }

    bind() {
        this.onKeyDown = bind(this, this.onKeyDown);
        this.onKeyUp = bind(this, this.onKeyUp);


        function bind(scope, fn) {
            return function () {
                fn.apply(scope, arguments);
            };
        }
    }

    setSelfView() {
        window.addEventListener('keydown', this.onKeyDown, false);
        window.addEventListener('keyup', this.onKeyUp, false);
    }

    setOtherView() {
        window.removeEventListener('keydown', this.onKeyDown, false);
        window.removeEventListener('keyup', this.onKeyUp, false);
    }


    update(delta) {
        //挂了
        if (this.player.status > this.status) {
            this.setOtherView();
        }
        //复活
        else if (this.player.status < this.status) {
            this.setSelfView();
        }
        this.status = this.player.status;

        // 如果活着
        if (!this.status) {
            let movementSpeed;

            if (this.run) {
                movementSpeed = RUN_SPEED;
            } else {
                movementSpeed = WALK_SPEED;
            }


            let direction = new THREE.Vector3();
            direction.x = Number(this.moveRight) - Number(this.moveLeft);
            direction.z = Number(this.moveBackward) - Number(this.moveForward);
            direction.y = 0;

            if (direction.x !== 0 || direction.y !== 0) {
                direction.normalize();
            }


            /*
            //底部碰撞检测

            let downRaycaster = new THREE.Raycaster(new THREE.Vector3(0,0,0), new THREE.Vector3( 0, -1, 0), 0, 10 + 0.000005);
            downRaycaster.ray.origin.copy(this.object.position);
            let intersections = downRaycaster.intersectObjects(scene.children, true);

            this.inAir = intersections.length <= 0;
            */


            //角色动画状态调整
            if (direction.x > 0) {
                if (direction.z > 0) {
                    this.player.action = "RunBackwardRight";
                } else if (direction.z < 0) {
                    this.player.action = "RunForwardRight";
                } else {
                    this.player.action = "RunRight";
                }
            } else if (direction.x < 0) {
                if (direction.z > 0) {
                    this.player.action = "RunBackwardLeft";
                } else if (direction.z < 0) {
                    this.player.action = "RunForwardLeft";
                } else {
                    this.player.action = "RunLeft";
                }
            } else {
                if (direction.z > 0) {
                    this.player.action = "RunBackwards";
                } else if (direction.z < 0) {
                    this.player.action = "RunForward";
                } else {
                    this.player.action = "Idle";
                }
            }

            //底部调整
            if (this.inAir) {

                this.ySpeed = (this.ySpeed - GRAVITATION_ACCELERATION * delta).toFixed(6);
            } else if (this.jump) {
                this.ySpeed = JUMP_SPEED;
                this.jump = false;
            }
            else {
                this.ySpeed = 0;
                //this.object.translateY((10 - intersections[0].distance));

            }
            this.player.model.translateY(this.ySpeed * delta);

            //移动
            if (this.moveForward || this.moveBackward) {
                this.player.model.translateZ(-movementSpeed * direction.z * delta);
            }
            if (this.moveLeft || this.moveRight) {
                this.player.model.translateX(-movementSpeed * direction.x * delta);
            }


        }
    }
}