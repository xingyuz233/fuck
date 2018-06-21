import * as THREE from "three";
import {Player} from "../role/player";
const RADIUS = 2;
const HEIGHT = 15;
const BOTTOM = 0.5;

export class CollisionController {

    constructor(keyController, scene) {
        let srcObject = keyController.player.model;

        this.keyController = keyController;
        this.scene = scene;
        this.upRaycaster = new THREE.Raycaster(srcObject.position, new THREE.Vector3(0, 1, 0), 0, HEIGHT + 0.000005);


    }


    adjust() {
        let keyController = this.keyController;
        if (this.keyController.player.status === Player.DEAD) {
            return;
        }
        let srcObject = this.keyController.player.model;
        let upRaycaster = this.upRaycaster;
        let scene = this.scene;

        let collisionResults;


        /**
         *  检测并调整周围碰撞
         *
         */


        let originPoint = srcObject.position.clone();
        for (let y = srcObject.position.y + HEIGHT; y >= srcObject.position.y + HEIGHT / 10; y -= 3 * HEIGHT / 10) {

            originPoint.y = y;
            for (let thita = 0; thita < 2 * Math.PI; thita += Math.PI / 2) {

                let directionVector = new THREE.Vector3(Math.cos(thita), 0, Math.sin(thita));
                let ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize(), 0, RADIUS);
                // 检测射线与多个物体的相交情况
                collisionResults = ray.intersectObjects(scene.children, true);
                // 如果返回结果不为空，且交点与射线起点的距离小于物体中心至顶点的距离，则发生了碰撞
                if (collisionResults.length > 0 && collisionResults[0].distance < RADIUS) {

                    let adjustVector = collisionResults[0].face.normal.applyMatrix4(collisionResults[0].object.matrixWorld).normalize();
                    let adjustDistance = RADIUS - collisionResults[0].distance;

                    srcObject.position.x = originPoint.x += adjustVector.x * (adjustDistance);  // crash 是一个标记变量
                    srcObject.position.z = originPoint.z += adjustVector.z * (adjustDistance);  // crash 是一个标记变量
                }
            }
        }





        /**
         * 检测并调整底部碰撞
         *
         */

        let originPosition = srcObject.position.clone();
        originPosition.y += HEIGHT/2;

        let downRaycaster = new THREE.Raycaster(originPosition, new THREE.Vector3(0, -1, 0), 0, HEIGHT/2 + 0.000005);


        collisionResults = downRaycaster.intersectObjects(scene.children, true);
        keyController.inAir = collisionResults.length <= 0;
        if (!keyController.inAir && !keyController.jump) {
            keyController.ySpeed = 0;
            let adjustVector = collisionResults[0].face.normal.applyMatrix4(collisionResults[0].object.matrixWorld).normalize();
            let adjustDistance = (HEIGHT/2-collisionResults[0].distance) * adjustVector.y;
            srcObject.position.y += adjustVector.y * adjustDistance;
            srcObject.position.x += adjustVector.x * adjustDistance;
            srcObject.position.z += adjustVector.z * adjustDistance;
        }

        /**
         * 检测并调整顶部碰撞
         */

        if (keyController.inAir || keyController.jump) {
            collisionResults = upRaycaster.intersectObjects(scene.children, true);
            if (collisionResults.length > 0) {
                keyController.ySpeed = -keyController.ySpeed;
            }
        }


    }


}