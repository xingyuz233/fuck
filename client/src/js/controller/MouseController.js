
import * as THREE from "three";
import {Player} from "../role/player";

export class MouseController {

    constructor(player, scene) {
        // let camera = player.camera;
        // let yawObject = player.model;
        // camera.rotation.set(0, 0, 0);
        //
        // let pitchObject = new THREE.Object3D();
        //
        // //let yawObject = new THREE.Object3D();
        //
        // //yawObject.position.y = 10;
        // yawObject.add(pitchObject);

        this.player = player;

        this.status = player.status;

        this.viewPlayer = player;

        this.scene = scene;

        // 用于selfView中的控制
        this.yawObject = player.model;
        this.pitchObject = player.pitchObject;
        // this.camera = scene.camera;

        this.enabled = false;
        this.press = false;
        this.bind();
        this.setSelfView();
    }



    onMouseMove( event ) {
        let PI_2 = Math.PI / 2;
        let yawObject = this.player.model;
        let pitchObject = this.player.pitchObject;

        if ( this.enabled === false ) {
            return;
        }
        let movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        let movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;


        yawObject.rotation.y -= movementX * 0.002;
        pitchObject.rotation.x += movementY * 0.002;

        pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );
    }

    onMouseDown(event) {
        if (this.enabled) {
            this.press = true;
            this.player.firing = true;
        } else {
            //document.body.requestPointerLock();
            //this.enabled = true;
        }
    };

    onMouseUp(event) {
        this.press = false;
        this.player.firing = false;
    }

    /*
    this.dispose = function() {

        window.removeEventListener( 'mousemove', _onMouseMove, false );

    };
    */


    getObject() {
        return this.yawObject;
    }



    hit() {

        const MAX_HIT_DISTANCE = 1000;
        let scene = this.scene;
        let camera = this.player.camera;

        let srcPos = this.pitchObject.position.clone();
        srcPos.applyMatrix4( this.player.model.matrixWorld);

        console.log(srcPos);
        console.log(this.player.model.position);
        let hitRaycaster = new THREE.Raycaster(srcPos, camera.getWorldDirection(new THREE.Vector3(0,0,0)), 0, MAX_HIT_DISTANCE);
        let collisionResults = hitRaycaster.intersectObjects(scene.children, true);
        let damage = 10;
        console.log(collisionResults);
        if (collisionResults.length > 0) {
            for (let i = 0; i < collisionResults.length; i++) {
                if (collisionResults[i].object &&
                    collisionResults[i].object.parent &&
                    collisionResults[i].object.parent.parent &&
                    collisionResults[i].object.parent.parent.playerid) {
                    console.log("hit!!");
                    let playerid = collisionResults[i].object.parent.parent.playerid;
                    let player = Player.get(playerid);
                    if (player.status === Player.LIVE) {
                        if (collisionResults[i].object.name === 'Soldier_body') {
                            console.log("hit the body!");
                            console.log(this.player.rifle);
                            if (this.player.rifle) {
                                damage = this.player.rifle.damage;
                            }
                        } else if (collisionResults[i].object.name === 'Solider_head'){
                            console.log("hit the head!");
                            if (this.player.rifle) {
                                damage = this.player.rifle.damage * 3;
                            }
                        } else {
                            damage = 0;
                        }
                        this.player.socket.emit('hit', {
                            'playerid': playerid,
                            'damage': damage,
                            'bodyPart': collisionResults[i].name
                        });
                        console.log("hit " + playerid + " for " + damage + " hp ");
                    }
                }
                else {
                    break;
                }
            }
        }

    }

    update() {
            // 观战的这个人刚刚死亡
            if (this.status < this.viewPlayer.status) {
                if (this.player === this.viewPlayer) {
                    this.setOtherView();
                }
                this.changeView();
                this.status = this.viewPlayer.status;
            }
            // 自己复活
            if (this.player.status < this.status) {
                this.setSelfView();
                this.status = this.player.status;
            }

            // 自己活着
            if (this.player.status === 0) {
                if (this.press) {
                    this.hit();
                }
            }
        /*
        else {
            camera.position = this.viewPlayer.model.position;
            camera.lookAt(this.viewPlayer.)
        }
        */

    }

    bind() {

        this.onMouseDown = bind(this, this.onMouseDown);
        this.onMouseMove = bind(this, this.onMouseMove);
        this.onMouseUp = bind(this, this.onMouseUp);

        this.changeView = bind(this, this.changeView);

        function bind(scope, fn) {
            return function () {
                fn.apply(scope, arguments);
            };
        }
    }


    setSelfView() {
        this.viewPlayer = this.player;
        this.scene.camera = this.viewPlayer.camera;
        this.isSelfView = true;
        window.removeEventListener('mousedown', this.changeView, false);
        window.addEventListener('mousemove', this.onMouseMove, false);
        window.addEventListener('mousedown', this.onMouseDown, false);
        window.addEventListener('mouseup', this.onMouseUp, false);
    }

    setOtherView() {
        this.isSelfView = false;
        window.removeEventListener('mousemove', this.onMouseMove, false);
        window.removeEventListener('mousedown', this.onMouseDown, false);
        window.removeEventListener('mouseup', this.onMouseUp, false);
        window.addEventListener('mousedown', this.changeView, false);
    }

    changeView() {
        let scope = this;
        setTimeout(function() {
            if (scope.viewPlayer.status === Player.LIVE) {
                scope.viewPlayer.visible = true;
            }
            scope.viewPlayer = scope.viewPlayer.getNextLivePlayer();
            scope.viewPlayer.visible = false;
            scope.scene.camera = scope.viewPlayer.camera;
        }, 3000);
    }



    /*
    getDirection = function() {

        // assumes the camera itself is not rotated

        let direction = new THREE.Vector3( 0, 0, - 1 );
        let rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

        return function( v ) {

            rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );

            v.copy( direction ).applyEuler( rotation );

            return v;

        };

    }();
    */


}

