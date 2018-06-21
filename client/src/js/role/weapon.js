import * as THREE from "three";
let FBXLoader = require('three-fbxloader-offical');



export class Weapon {
    constructor() {
        this.damage = 0;
        this.firingRate = 0;
        this.recoil = 0;
        this.clipSize = 0;
    }

    //复制一个枪械模型
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

    //初始化所有枪械模型sample。
    static initialWeaponModels() {
        let promiseList = [Rifle.initialRifleModels()];
        Promise.all(promiseList).then(results => {
            return new Promise((resolve, reject) => {
                resolve("ok")
            });
        });
    }

    //判断某个枪械模型是否出现在场景中，若出现，返回包装它的weapon对象
    static findWeaponInScene(model) {
        for (let index in Weapon.weaponsInScene) {
            if (Weapon.weaponsInScene[index].model === model) {
                return Weapon.weaponsInScene[index];
            }
        }
        return null;

    }
}

export class Rifle extends Weapon {
    constructor() {
        super();
        this.kind = 'rifle';
    }

    showM4A1() {
        this.damage = 30;
        this.firingRate = 10;
        this.recoil = 5;
        this.clipSize = 30;

        this.rifleName = 'm4a1';
        this.model = Weapon.cloneFbx(Rifle.rifleModelList['m4a1']);
    }

    static initialRifleModels() {
        let promiseList = [
            Rifle.initialM4A1Model()
        ];

        Promise.all(promiseList).then(results => {
            return new Promise((resolve, reject) => {
                resolve("ok")
            });
        });
    }

    static initialM4A1Model() {
        return new Promise((resolve, reject) => {
            let loader = new FBXLoader();
            loader.load('static/models/weapons/m4a1/m4a1_s.fbx', function (object) {
                console.log(object);
                object.scale.set(2,2,2);
                object.rotation.y = -Math.PI*2/3;
                object.rotation.z = -Math.PI/2;
                object.position.set(-5,-10,18);
                Rifle.rifleModelList['m4a1'] = object;
                resolve(object);
            })

        });
    }

}
export class Knife extends Weapon {
    constructor() {
        super();
    }
}

Weapon.weaponsInScene = [];
Rifle.rifleModelList = {};