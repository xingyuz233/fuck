import * as THREE from "three";
import * as MTLLoader from "../loader/MTLLoader";
import * as OBJLoader from "../loader/OBJLoader";
export class GameMap {
    constructor() {

    }
    setModel(model) {
        this.model = model;
    }


    setTerroristArea(left, right, bottom, top, height) {
        this.terroristArea = {
            left:left,
            right:right,
            bottom:bottom,
            top:top,
            height:height
        };
        let xStep = (right - left) / 2;
        let yStep = (top - bottom) / 2;
        this.terroristPositions = [];

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                this.terroristPositions.push(new THREE.Vector3(left + i*yStep, height, bottom + j*xStep));
            }
        }

    }

    setCounterTerroristArea(left, right, bottom, top, height) {
        this.counterTerroristArea = {
            left:left,
            right:right,
            bottom:bottom,
            top:top,
            height:height
        };
        let xStep = (right - left) / 2;
        let yStep = (top - bottom) / 2;
        this.counterTerroristPositions = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                this.counterTerroristPositions.push(new THREE.Vector3(left + i*yStep, height, bottom + j*xStep));
            }
        }

    }

    setAsiteArea(left, right, bottom, top) {
        this.AsiteArea = {
            left:left,
            right:right,
            bottom:bottom,
            top:top
        };
    };

    setBsiteArea(left, right, bottom, top) {
        this.BsiteArea = {
            left:left,
            right:right,
            bottom:bottom,
            top:top
        };
    };

    inTerroristArea(position) {
        return position.x < this.terroristArea.right && position.x > this.terroristArea.left &&
            position.z < this.terroristArea.top && position.z > this.terroristArea.bottom;
    }

    inCounterTerroristArea(position) {
        return position.x < this.counterTerroristArea.right && position.x > this.counterTerroristArea.left &&
            position.z < this.counterTerroristArea.top && position.z > this.counterTerroristArea.bottom;
    }

    inAsite(position) {
        return position.x < this.AsiteArea.right && position.x > this.AsiteArea.left &&
            position.z < this.AsiteArea.top && position.z > this.AsiteArea.bottom;
    }

    inBsite(position) {
        return position.x < this.BsiteArea.right && position.x > this.BsiteArea.left &&
            position.z < this.BsiteArea.top && position.z > this.BsiteArea.bottom;
    }


    showDust2(scene) {
        // 如果当前存在地图，删除当前地图
        if (this.model) {
            scene.remove(this.model);
            this.setModel(null);
        }
        this.setTerroristArea(-100, -50, -160, -100, 0);
        this.setCounterTerroristArea(90, 140, -760, -680, -45);
        this.setAsiteArea(255,300,-755,-725);
        this.setBsiteArea(194,255,-832,-765);

        let mtlLoader = new MTLLoader();
        let scope = this;
        mtlLoader.load('static/models/maps/dust2/model.mtl', function(materials) {
            //materials.preload();
            let objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load('static/models/maps/dust2/model.obj', function(object) {
                object.rotateX(-Math.PI / 2);
                object.scale.set(10,10,10);
                scene.add(object);
                scope.setModel(object);
            });
        });

    }

}

