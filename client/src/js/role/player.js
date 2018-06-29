//import * as THREE from "three";

import * as THREE from "three";
let FBXLoader = require('three-fbxloader-offical');
import {Weapon, Rifle, Knife} from "./weapon";

export class Player {
    constructor(socketid, name, camp, index) {
        this.socketid = socketid;
        this.name = name;
        this.camp = camp;
        this.online = true;
        this.hp = 100;
        this.index = index;

        this.status = Player.LIVE;
        this.firing = false;
        this.kills = 0;
        this.dies = 0;


        if (camp === Player.TERRORIST_CAMP) {
            Player.terroristMap.set(socketid, this);
        } else {
            Player.counterTerroristMap.set(socketid, this);
        }
    }

    setBornPosition(gameMap) {
        if (this.camp === Player.TERRORIST_CAMP) {
            this.bornPosition = gameMap.terroristPositions[this.index];
        } else {
            this.bornPosition = gameMap.counterTerroristPositions[this.index];
        }
    }

    /*

    setModel(scene, position, modelName) {
        if (this.model) {
            scene.remove(this.model);
            this.model = null;
        }

        this.initialModel(Player.modelList[modelName]);
        if (position) {
            this.model.position.set(position.x, position.y, position.z);
        } else {
            this.model.position.set(this.bornPosition.x, this.bornPosition.y, this.bornPosition.z);
        }
        scene.add(this.model);
    }

    setSwatModel(scene, position) {
        this.setModel(scene, position, 'swat');
    }
    */


    // showCylinder(scene, position) {
    //     if (this.model) {
    //         scene.remove(this.model);
    //         this.model = null;
    //     }
    //
    //
    //     let tmp_mesh = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 2, 8, 8), new THREE.MeshPhongMaterial({
    //         opacity: 0.5,
    //         transparent: true,
    //     }));
    //
    //     this.initialPlayerObj(tmp_mesh);
    //
    //
    //
    //     if (position) {
    //         tmp_mesh.position.set(position.x, position.y, position.z);
    //     } else {
    //         tmp_mesh.position.set(this.bornPosition.x, this.bornPosition.y, this.bornPosition.z);
    //     }
    //
    //     scene.add(tmp_mesh);
    //
    //     let scope = this;
    //     let loader = new FBXLoader();
    //     loader.load( 'static/models/player/swat/Idle.fbx', function ( object ) {
    //         let p1 = new Promise((resolve, reject) => {
    //             loader.load('static/models/player/swat/Run Forward.fbx', function (object1) {
    //                 object.animations.push(object1.animations[0]);
    //                 resolve("ok");
    //             });
    //         });
    //         let p2 = new Promise((resolve, reject) => {
    //             loader.load('static/models/player/swat/Run Backwards.fbx', function (object1) {
    //                 object.animations.push(object1.animations[0]);
    //                 resolve("ok");
    //             });
    //         });
    //         let p3 = new Promise((resolve, reject) => {
    //             loader.load('static/models/player/swat/Run Left.fbx', function (object1) {
    //                 object.animations.push(object1.animations[0]);
    //                 resolve("ok");
    //             });
    //         });
    //
    //         Promise.all([p1, p2, p3]).then(function (results) {
    //             console.log(results); // 获得一个Array: ['P1', 'P2']
    //             console.log(object);
    //             object.mixer = new THREE.AnimationMixer( object );
    //
    //             let action = object.mixer.clipAction( object.animations[ 0 ] );
    //             action.play();
    //
    //             /*
    //             object.traverse( function ( child ) {
    //
    //                 if ( child.isMesh ) {
    //
    //                     child.castShadow = true;
    //                     child.receiveShadow = true;
    //
    //                 }
    //
    //             } );
    //
    //
    //             console.log(object);
    //             object.position.set(tmp_mesh.position.x+ 10, tmp_mesh.position.y + 10, tmp_mesh.position.z + 10);
    //             scene.add(object);
    // */
    //             object.scale.set(0.01,0.01,0.01);
    //
    //             object.position.set(tmp_mesh.position.x, tmp_mesh.position.y, tmp_mesh.position.z);
    //             scene.remove(tmp_mesh);
    //             object.add(scope.pitchObject);
    //             scope.model = object;
    //             scene.add(object);
    //         });
    //     } );
    // }



    initialModel(modelName, position) {
        let scope = this;
        let promise;
        console.log(modelName);
        switch (modelName) {
            case 'swat':
                promise = Player.loadSwatModel().then(model => {
                    return new Promise((resolve, reject) => {
                        scope.model = model;
                        scope.initialModelView();
                        scope.initialModelPosition(position);
                        scope.action = "Idle";
                        resolve("initial swat model ok");
                    });
                });
                break;
        }
        return promise;
    }



    initialModelView() {
        let object = this.model;
        //Player.initialActions(object);

        let pitchObject = new THREE.Object3D();

        object.add(pitchObject);
        pitchObject.position.y += object.height;
        pitchObject.position.z += 0;
        pitchObject.rotation.y += Math.PI;
        console.log(pitchObject);

        let camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
        //camera.lookAt(0,0,1);
        //camera.rotation.y += Math.PI;
        pitchObject.add(camera);
        object.add(pitchObject);
        object.playerid = this.socketid;
        this.camera = camera;
        this.pitchObject = pitchObject;
    }

    initialModelPosition(position) {
        if (position) {
            this.model.position.set(position.x, position.y, position.z);
        } else {
            this.model.position.set(this.bornPosition.x, this.bornPosition.y, this.bornPosition.z);
        }
    }

    equipRifle(rifle) {
        if (this.rifle) {
            this.rifle = null;
            this.model.righthand.children.splice(this.model.righthand.children.indexOf(this.rifle), 1);
        }
        this.rifle = rifle;
        this.model.righthand.children.push(rifle.model);
        rifle.model.parent = this.model.righthand;
    }

    buyRifle(rifleName) {
        let rifle = new Rifle();
        switch(rifleName) {
            case 'm4a1':
                rifle.showM4A1();

        }
        if (rifle.model) {
            this.equipRifle(rifle);
        }
    }




    setPosition(position) {
        this.model.position.set(position.x, position.y, position.z);
    }

    setRotation(rotation) {
        this.model.rotation.y = rotation.y;
        this.pitchObject.rotation.x = rotation.x;
    }

    kill() {
        this.kills++;
        if (this.camp === Player.TERRORIST_CAMP) {
            Player.terroristKills++;
        } else {
            Player.counterTerroristKills++;
        }
    }

    die(bodyPart, hitDirection) {
        this.dies++;
        this.status = Player.DEAD;
        if (bodyPart === 'head') {
            if (hitDirection === 'back') {
                this.playDeathAction("DeathFromBackHeadshot");
            } else {
                this.playDeathAction("DeathFromFrontHeadshot");
            }
        } else {
            if (hitDirection === 'back') {
                this.playDeathAction("DeathFromTheBack");
            } else {
                this.playDeathAction("DeathFromTheFront");
            }
        }


        //this.reset();
        //this.hp = 100;
    }

    directionFrom(player) {

        let diffDirection = new THREE.Vector3();

        diffDirection.subVectors(player.model.position, this.model.position);

        let cameraFrontDirection = this.camera.getWorldDirection();
        cameraFrontDirection.y = 0;
        cameraFrontDirection = cameraFrontDirection.normalize();
        let cameraRightDirection = new THREE.Vector3();
        cameraRightDirection.crossVectors(cameraFrontDirection, new THREE.Vector3(0,1,0));

        let viewDirection = new THREE.Vector3(
            diffDirection.dot(cameraRightDirection),
            0,
            diffDirection.dot(cameraFrontDirection)
        );

        if (Math.abs(viewDirection.x) > Math.abs(viewDirection.z)) {
            if (viewDirection.x < 0) {
                return "left";
            } else {
                return "right"
            }
        } else {
            if (viewDirection.z < 0) {
                return "back";
            }
            else {
                return "front";
            }
        }



    }


    reset() {
        this.status = Player.LIVE;
        this.hp = 100;
        this.model.position.set(this.bornPosition.x, this.bornPosition.y, this.bornPosition.z);
    }

    toObject() {
        return {
            'socketid': this.socketid,
            'name': this.name,
            'camp': this.camp,
            'index': this.index,
            'position': {x: this.model.position.x, y: this.model.position.y, z: this.model.position.z},
            'rotation': {x: this.pitchObject.rotation.x, y: this.model.rotation.y},
            'action': this.action,
            'rifle': this.rifle,
            'firing': this.firing
        }
    }

    //用于观战时视角的切换
    getNextLivePlayer() {
        let livePlayers;
        if (this.camp === Player.TERRORIST_CAMP) {
            livePlayers = Player.getLiveTerrorists();
        } else {
            livePlayers = Player.getLiveCounterTerrorists();
        }
        if (livePlayers.length === 0) {
            return this;
        }

        let index = livePlayers.indexOf(this);
        if (index >= 0 && index < livePlayers.length - 1) {
            return livePlayers[index + 1];
        } else {
            return livePlayers[0];
        }
    }


    updateMixer(delta) {
        if (this.model && this.model.mixer) {
            this.model.mixer.update(delta);
        }
    }

    updateShoulderRotation() {
        if (this.model && this.model.shoulder && this.pitchObject) {
            this.model.shoulder.rotation.x = this.pitchObject.rotation.x;
        }
    }

    playRunAction(action) {
        if (this.model && this.model.runActionList) {
            this.model.runActionList[action].play();

            for (let index in this.model.runActionList) {
                if (index !== action) {
                    this.model.runActionList[index].stop();
                }
            }
        }
    }

    playDeathAction(action) {
        let scope = this;
        if (this.model && this.model.deathActionList) {
            this.model.deathActionList[action].play();
            setTimeout(function() {
                scope.model.deathActionList[action].stop();
                scope.model.visible = false;
            },3000);
        }

    }



    playFireAction() {
        let action = "FiringRifle";
        if (this.model && this.model.fireActionList) {
            this.model.fireActionList[action].play();
            /*
            for (let index in this.model.fireActionList) {
                if (index !== action) {
                    this.stopFireAction()
                }
            }
            */
        }
    }
    stopFireAction() {
        let action = "FiringRifle";
        if (this.model && this.model.fireActionList) {
            this.model.fireActionList[action].stop();
        }
    }

    playIdle() {
        this.playAction('Idle');
    }
    playRunForward() {
        this.playAction('RunForward');
    }
    playRunBackwords() {
        this.playAction('RunBackwards');
    }
    playRunLeft() {
        this.playAction('RunLeft');
    }
    playRunRight() {
        this.playAction('RunRight');
    }



    static get(socketid) {
        if (Player.terroristMap.has(socketid)) {
            return Player.terroristMap.get(socketid);
        }
        else if (Player.counterTerroristMap.has(socketid)) {
            return Player.counterTerroristMap.get(socketid);
        }
    }

    static getLiveTerrorists() {
        let lives = [];
        for (let value of Player.terroristMap.values()) {
            if (value.status === Player.LIVE) {
                lives.push(value);
            }
        }
        return lives;
    }

    static getLiveCounterTerrorists() {
        let lives = [];
        for (let value of Player.counterTerroristMap.values()) {
            if (value.status === Player.LIVE) {
                lives.push(value);
            }
        }
        return lives;
    }

    static getSortedTerrorists() {
        let list = [];
        for (let value of Player.terroristMap.values()) {
            list.push(value);
        }
        return list;
    }
    static getSortedCounterTerrorists() {
        let list = [];
        for (let value of Player.counterTerroristMap.values()) {
            list.push(value);
        }
        return list;
    }

    static getDeadTerrorists() {
        let lives = [];
        for (let value of Player.terroristMap.values()) {
            if (value.status === Player.DEAD) {
                lives.push(value);
            }
        }
        return lives;
    }
    static getDeadCounterTerrorists() {
        let lives = [];
        for (let value of Player.counterTerroristMap.values()) {
            if (value.status === Player.DEAD) {
                lives.push(value);
            }
        }
        return lives;
    }

    static resetAll() {
        for (let value of Player.counterTerroristMap.values()) {
            value.reset();
        }
        for (let value of Player.terroristMap.values()) {
            value.reset();
        }
    }



    static update(delta) {
        for (let value of Player.counterTerroristMap.values()) {
            value.updateMixer(delta);
            value.updateShoulderRotation();
            value.playRunAction(value.action);
            if (value.firing) {
                value.playFireAction();
            } else {
                value.stopFireAction();
            }
        }
        for (let value of Player.terroristMap.values()) {
            value.updateMixer(delta);
            value.updateShoulderRotation();
            value.playRunAction(value.action);
            if (value.firing) {
                value.playFireAction();
            } else {
                value.stopFireAction();
            }
        }
    }

    static loadSwatModel() {
        let loader = new FBXLoader();
        let model;


        return new Promise((resolve, reject) => {
            loader.load('static/models/player/swat/ty.fbx', function (object) {
                console.log(object);
                model = object;
                object.traverse( function ( child ) {
                    if ( child.isMesh ) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                } );
                model.scale.set(0.05, 0.05, 0.05);
                //model.rotateY(Math.PI);
                //Player.modelList['swat'] = model;
                console.log(model);

                model.shoulder = model.children[8].children[3].children[1].children[1];
                console.log(model.shoulder);
                model.righthand = model.children[8].children[3].children[1].children[1].
                    children[2].children[1].children[1].children[1];
                model.height = 170;

                Player.initialActions(model);
                resolve(model);
            });
        });
        // return Promise.all([p]).then(function (results) {
        //     return new Promise((resolve, reject) => {
        //         console.log(results);
        //         /*
        //         for (let i = 0; i < results.length; i++) {
        //             model.animations[i] = results[i];
        //         }
        //         */
        //         //model.rotateY(Math.PI);
        //         model.scale.set(0.05, 0.05, 0.05);
        //         //model.rotateY(Math.PI);
        //         //Player.modelList['swat'] = model;
        //         console.log(model);
        //
        //         model.shoulder = model.children[8].children[1].children[1].children[1];
        //         console.log(model.shoulder);
        //         model.righthand = model.children[8].children[1].children[1].children[1].
        //             children[3].children[1].children[1].children[1];
        //         model.height = 170;
        //
        //         Player.initialActions(model);
        //         resolve(model);
        //     });
        // });
        //
    }


    static initialActions(model) {
        //let model = this.model;
        model.mixer = new THREE.AnimationMixer(model);
        model.runActionList = {};
        model.runActionList['Idle'] = model.mixer.clipAction(model.animations[0]);
        model.runActionList['RunForward'] = model.mixer.clipAction(model.animations[6]);
        model.runActionList['RunBackwards'] = model.mixer.clipAction(model.animations[5]);
        model.runActionList['RunLeft'] = model.mixer.clipAction(model.animations[11]);
        model.runActionList['RunRight'] = model.mixer.clipAction(model.animations[7]);
        model.runActionList['RunForwardLeft'] = model.mixer.clipAction(model.animations[13]);
        model.runActionList['RunForwardRight'] = model.mixer.clipAction(model.animations[14]);
        model.runActionList['RunBackwardLeft'] = model.mixer.clipAction(model.animations[3]);
        model.runActionList['RunBackwardRight'] = model.mixer.clipAction(model.animations[10]);
        model.jumpActionList = {};
        model.jumpActionList['Jump'] = model.mixer.clipAction(model.animations[4]);
        model.fireActionList = {};
        model.fireActionList['FiringRifle'] = model.mixer.clipAction(model.animations[2]);
        model.deathActionList = {};
        model.deathActionList['DeathFromTheFront'] = model.mixer.clipAction(model.animations[8]);
        model.deathActionList['DeathFromTheBack'] = model.mixer.clipAction(model.animations[12]);
        model.deathActionList['DeathFromFrontHeadshot'] = model.mixer.clipAction(model.animations[9]);
        model.deathActionList['DeathFromBackHeadshot'] = model.mixer.clipAction(model.animations[1]);
    }



        /*
        static initialPlayerModel() {
            let swatModelPromise = Player.initialSwatModel();

            return swatModelPromise.then((results) => {
                return new Promise((resolve, reject) => {
                    console.log(results);
                    console.log("swatModel loaded");
                    resolve('ok');
                });
            });
        }
        */


    static cloneFbx(fbx) {
        const clone = fbx.clone(true)

        clone.animations = fbx.animations
        clone.skeleton = { bones: [] }

        const skinnedMeshes = {}

        fbx.traverse(node => {
            if (node.isSkinnedMesh) {
                skinnedMeshes[node.name] = node
            }
        })

        const cloneBones = {}
        const cloneSkinnedMeshes = {}

        clone.traverse(node => {
            if (node.isBone) {
                cloneBones[node.name] = node
            }

            if (node.isSkinnedMesh) {
                cloneSkinnedMeshes[node.name] = node
            }
        })

        for (let name in skinnedMeshes) {
            const skinnedMesh = skinnedMeshes[name]
            const skeleton = skinnedMesh.skeleton
            const cloneSkinnedMesh = cloneSkinnedMeshes[name]

            const orderedCloneBones = []

            for (let i=0; i<skeleton.bones.length; i++) {
                const cloneBone = cloneBones[skeleton.bones[i].name]
                orderedCloneBones.push(cloneBone)
            }

            cloneSkinnedMesh.bind(
                new THREE.Skeleton(orderedCloneBones, skeleton.boneInverses),
                cloneSkinnedMesh.matrixWorld)

            // For animation to work correctly:
            clone.skeleton.bones.push(cloneSkinnedMesh)
            clone.skeleton.bones.push(...orderedCloneBones)
        }

        return clone
    }


    setAvatar(avaId) {

        this.avatarID = avaId;
        if (avaId == undefined) this.avatarID = 0;
    }

    setOut() {
        this.model.visible = false;
        let timer = setInterval(() => {
            this.model.position.y += 0.5;
            this.camera.position.y += 0.5;
            if (this.model.position.y >= 30) {
                clearInterval(timer);
            }

        }, 25);
        //this.model.position.y = 30;
        // this.camera.position.y = 30;
    }

    setLocal() {
        this.isLocal = true;
    }


    setIndex(index) {
        this.index = index;
    }

    addToScene(scene, x, y, z) {
        scene.add(this.model);
        this.model.position.x = x;
        this.model.position.y = y;
        this.model.position.z = z;
    }

    /*

    move(camera,x,y,z) {
        let re = true;
        this.camera = camera;
        if (this.isLocal) {
            if(camera.position.x == this.model.position.x && camera.position.z == this.model.position.z) re = false;
            if(!this.isOut) {
                let vector = camera.getWorldDirection();
                //this.model.lookAt()
                this.model.position.x = camera.position.x - vector.x * 0;
                this.model.position.z = camera.position.z - vector.z * 0;
                this.model.rotation.y = (vector.x >= 0 ? Math.acos(vector.z) : Math.PI * 2 - Math.acos(vector.z));
            }
        }
        else {
            let vector = new THREE.Vector3(x,y,z);
            this.model.lookAt(vector);
            //let vector = getSocketPosition(this);
            this.model.position.x = x;
            this.model.position.y = y;
            this.model.position.z = z;

        }
        // console.log("player " + this.id + "(" + this.model.position.x + " " + this.model.position.z + ")");
        return re;
    }
    */

}

class TestPlayer extends Player {

    constructor(name, id, scene, x, y, z) {
        super(name, id);
        let scope = this;
        let loader = new THREE.FBXLoader();

        loader.load('models/player/woman/file.fbx', function (object) {

            scope.model = object;

            //object.mixer = new THREE.AnimationMixer( object );
            //mixers.push( object.mixer );

            //let action = object.mixer.clipAction( object.animations[ 0 ] );
            //action.play();
            /*
            object.traverse( function ( child ) {

                if ( child.isMesh ) {

                    child.castShadow = true;
                    child.receiveShadow = true;

                }

            } );
            */
            this.model.scale.set(0.01, 0.01, 0.01);


        });
        /*
        while (true) {
            if (scope.model !== undefined) {
                break;
            }
        }
        */
    }
}

function getSocketPosition(player) {
    let re = new THREE.Vector3(player.model.position.x, player.model.position.y, player.model.position.z);
    //re.x += 0.05;
    //re.z += 0.05;
    return re;
}



Player.TERRORIST_CAMP = 0;
Player.COUNTERTERRORIST_CAMP = 1;

Player.LIVE = 0;
Player.DEAD = 1;

Player.IDLE = 0;
Player.RUN_FORWARD = 1;
Player.RUN_BACKWARDS = 2;
Player.RUN_LEFT = 3;
Player.RUN_RIGHT = 4;


Player.terroristMap = new Map();
Player.counterTerroristMap = new Map();
Player.terroristKills = 0;
Player.counterTerroristKills = 0;
Player.terroristWins = 0;
Player.counterTerroristWins = 0;
Player.ActionList = {};



