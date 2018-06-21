//Physijs.scripts.worker = 'js/physijs/physijs_worker.js';
//Physijs.scripts.ammo = 'ammo.js';
import * as io from "socket.io-client";


import * as THREE from "three";
import * as OBJLoader from "./loader/OBJLoader";
import * as MTLLoader from "./loader/MTLLoader";
import {Stats} from "./stats/stats";
import {CollisionController} from "./controller/CollisionController.js";
import {MouseController} from "./controller/MouseController";
import {KeyController} from "./controller/KeyController";

import {Player} from "./role/player";
import {Weapon, Rifle, Knife} from "./role/weapon";
import {GameMap} from "./role/gameMap";


let clock;

let renderer;
let render_stats;
let physics_stats;
let camera;
let scene;
let textureLoader;
let groundGeometry;
let groundMaterial;
let groundMesh;
let light;
let keyController;
let mouseController;
let collisionController;
let hitController;
let blocker;
let instructions;
let player;

let gameMap;

const connectionUrl = "http://120.79.227.127:3000";
let socket = io.connect(connectionUrl);
let playerMap = new Map();


initElement();
initClock();
initRenderer();
initStats();
initScene();
initCamera();
initLight();
//initGround();
//initSky();
initGameMap();
initController();

initPointerLock();
//animate();


function initElement() {
    blocker = document.getElementById('blocker');
    instructions = document.getElementById('instructions');
}

function initClock() {
    clock = new THREE.Clock();
}

function initRenderer() {
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;
    document.body.appendChild(renderer.domElement);
}

function initStats() {
    render_stats = new Stats();
    render_stats.domElement.style.position = 'absolute';
    render_stats.domElement.style.top = '1px';
    render_stats.domElement.style.zIndex = 100;
    blocker.appendChild(render_stats.domElement);

    physics_stats = new Stats();
    physics_stats.domElement.style.position = 'absolute';
    physics_stats.domElement.style.top = '50px';
    physics_stats.domElement.style.zIndex = 100;
    blocker.appendChild(physics_stats.domElement);

}

function initScene() {
    /*
    scene = new Physijs.Scene();
    scene.setGravity(new THREE.Vector3(0, -10, 0));
    scene.addEventListener(
        'update',
        function() {

            scene.simulate( undefined, 1 );
            physics_stats.update();
        }
    );
    scene.simulate();
    */
    scene = new THREE.Scene();
}

function initCamera() {
    //camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
    scene.camera = camera;
}

function initLight() {


    //light = new THREE.PointLight(0xffffff, new THREE.Vector3(0,10,0), 0, 1000);
    light = new THREE.AmbientLight(0xffffff);
    //light.position.set(0, 0.5, 1).normalize();
    //light.castShadow = true;
    //scene.add(light);
    //light = new THREE.DirectionalLight(0xffffff);
    //light.position.set(0, 0.5, 1).normalize();
    scene.add(light);
}

/*
function initGround() {
    textureLoader = new THREE.TextureLoader();
    groundMaterial = Physijs.createMaterial(
        new THREE.MeshLambertMaterial({
        map: textureLoader.load('image/grasslight-big.jpg')
    }),
        .0, //high friction
        .0  //low restitution
    );
    groundMaterial.map.wrapS = groundMaterial.map.wrapT = THREE.RepeatWrapping;
    groundMaterial.map.repeat.set(100, 100);

    groundGeometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
    groundGeometry.rotateX(-Math.PI / 2);



    groundMesh = new Physijs.BoxMesh(groundGeometry , groundMaterial, 0);
    scene.add(groundMesh);


    // build the base geometry for each building
    var geometry = new THREE.CubeGeometry( 1, 1, 1 );
// translate the geometry to place the pivot point at the bottom instead of the center
    geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0.5, 0 ) );
// get rid of the bottom face - it is never seen
    geometry.faces.splice( 3, 1 );
    geometry.faceVertexUvs[0].splice( 3, 1 );
// change UVs for the top face
// - it is the roof so it wont use the same texture as the side of the building
// - set the UVs to the single coordinate 0,0. so the roof will be the same color
//   as a floor row.
    geometry.faceVertexUvs[0][2][0].set( 0, 0 );
    geometry.faceVertexUvs[0][2][1].set( 0, 0 );
    geometry.faceVertexUvs[0][2][2].set( 0, 0 );
    //geometry.faceVertexUvs[0][2][3].set( 0, 0 );
// buildMesh
    var buildingMesh= new THREE.Mesh( geometry );

// base colors for vertexColors. light is for vertices at the top, shaddow is for the ones at the bottom
    var light = new THREE.Color( 0xffffff )
    var shadow    = new THREE.Color( 0x303050 )

    var cityGeometry= new THREE.Geometry();

    for( var i = 0; i < 400; i ++ ){
        // put a random position
        buildingMesh.position.x   = Math.floor( Math.random() * 200 - 100 ) * 10;
        buildingMesh.position.z   = Math.floor( Math.random() * 200 - 100 ) * 10;
        // put a random rotation
        buildingMesh.rotation.y   = Math.random()*Math.PI*2;
        // put a random scale
        buildingMesh.scale.x  = Math.random() * Math.random() * Math.random() * Math.random() * 50 + 10;
        buildingMesh.scale.y  = (Math.random() * Math.random() * Math.random() * buildingMesh.scale.x) * 8 + 8;
        buildingMesh.scale.z  = buildingMesh.scale.x

        // establish the base color for the buildingMesh
        var value   = 1 - Math.random() * Math.random();
        var baseColor   = new THREE.Color().setRGB( value + Math.random() * 0.1, value, value + Math.random() * 0.1 );
        // set topColor/bottom vertexColors as adjustement of baseColor
        var topColor    = baseColor.clone().multiply( light );
        var bottomColor = baseColor.clone().multiply( shadow );
        // set .vertexColors for each face
        var geometry    = buildingMesh.geometry;
        for ( var j = 0, jl = geometry.faces.length; j < jl; j ++ ) {
            if ( j === 2 ) {
                // set face.vertexColors on root face
                geometry.faces[ j ].vertexColors = [ baseColor, baseColor, baseColor, baseColor ];
            } else {
                // set face.vertexColors on sides faces
                geometry.faces[ j ].vertexColors = [ topColor, bottomColor, bottomColor, topColor ];
            }
        }
        // merge it with cityGeometry - very important for performance
        THREE.GeometryUtils.merge( cityGeometry, buildingMesh );
    }

// generate the texture
    var texture       = new THREE.Texture( generateTexture() );
    texture.anisotropy = renderer.getMaxAnisotropy();
    texture.needsUpdate    = true;

// build the mesh
    var material  = new THREE.MeshLambertMaterial({
        map     : texture,
        vertexColors    : THREE.VertexColors
    });
    var cityMesh = new THREE.Mesh(cityGeometry, material );
    scene.add(cityMesh);

    function generateTexture() {
        // build a small canvas 32x64 and paint it in white
        var canvas  = document.createElement( 'canvas' );
        canvas.width = 32;
        canvas.height    = 64;
        var context = canvas.getContext( '2d' );
        // plain it in white
        context.fillStyle    = '#ffffff';
        context.fillRect( 0, 0, 32, 64 );
        // draw the window rows - with a small noise to simulate light variations in each room
        for( var y = 2; y < 64; y += 2 ){
            for( var x = 0; x < 32; x += 2 ){
                var value   = Math.floor( Math.random() * 64 );
                context.fillStyle = 'rgb(' + [value, value, value].join( ',' )  + ')';
                context.fillRect( x, y, 2, 1 );
            }
        }

        // build a bigger canvas and copy the small one in it
        // This is a trick to upscale the texture without filtering
        var canvas2 = document.createElement( 'canvas' );
        canvas2.width    = 512;
        canvas2.height   = 1024;
        var context = canvas2.getContext( '2d' );
        // disable smoothing
        context.imageSmoothingEnabled        = false;
        context.webkitImageSmoothingEnabled  = false;
        context.mozImageSmoothingEnabled = false;
        // then draw the image
        context.drawImage( canvas, 0, 0, canvas2.width, canvas2.height );
        // return the just built canvas2
        return canvas2;
    }




}
*/

function initSky() {
    // Skybox
    let textureLoader = new THREE.TextureLoader();
    let materials = [
        new THREE.MeshBasicMaterial({map: textureLoader.load('models/skybox/px.jpg')}), // right
        new THREE.MeshBasicMaterial({map: textureLoader.load('models/skybox/nx.jpg')}), // left
        new THREE.MeshBasicMaterial({map: textureLoader.load('models/skybox/py.jpg')}), // top
        new THREE.MeshBasicMaterial({map: textureLoader.load('models/skybox/ny.jpg')}), // bottom
        new THREE.MeshBasicMaterial({map: textureLoader.load('models/skybox/pz.jpg')}), // back
        new THREE.MeshBasicMaterial({map: textureLoader.load('models/skybox/nz.jpg')})  // front
    ];
    let mesh = new THREE.Mesh(new THREE.BoxGeometry(10000, 10000, 10000, 7, 7, 7), new THREE.MultiMaterial(materials));
    mesh.position.y = 1000;
    mesh.scale.y = -1;
    scene.add(mesh);
}

function initGameMap() {
    /*
    let loader = new THREE.FBXLoader();
    loader.load( 'models/maps/dust2/dust2.fbx', function ( geometry ) {
        scene.add( new THREE.Mesh( geometry ) );
        //geometry.rotateX(-Math.PI / 2);
        geometry.castShadow = true;
        geometry.receiveShadow = true;
    });
    */

    /*
    let mtlLoader = new MTLLoader();

    mtlLoader.load('static/models/maps/dust2/model.mtl', function(materials) {
        //materials.preload();
        let objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load('static/models/maps/dust2/model.obj', function(object) {
            object.rotateX(-Math.PI / 2);
            object.scale.set(10,10,10);
            scene.add(object);
            console.log(scene);
        });
    });
    */
    gameMap = new GameMap();
    gameMap.showDust2(scene);

    /*
    var loader = new THREE.ColladaLoader();
    loader.load( 'models/maps/dust2_color/model.dae', function ( collada ) {

        //var animations = collada.animations;
        var avatar = collada.scene;
        console.log(avatar);

        //mixer = new THREE.AnimationMixer( avatar );
        //var action = mixer.clipAction( animations[ 0 ] ).play();

        scene.add( avatar );

    } );
       */

    /*
    let loader = new THREE.OBJLoader();
    loader.addEventListener('load', function (event) {
        let obj = event.content;
        scene.add(obj);

    });
    loader.load()
    */

}

function initController() {
    //player
    /*
    let fp_mesh = new Physijs.BoxMesh(new THREE.CubeGeometry(4, 10, 4), Physijs.createMaterial(new THREE.MeshPhongMaterial({
        opacity: 0,
        transparent: true
    })), 1);
*/
    /*
    let fp_mesh = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 20, 8, 8), new THREE.MeshPhongMaterial({
        opacity: 1,
        transparent: true
    }));
*/


    //scene.add(fp_mesh);

    //Controller

    // let camp = Player.COUNTERTERRORIST_CAMP;
    //
    // let name = "xingyu";
    //
    // let index = 8;
    //
    //
    // player = new Player(0, name, camp, index);
    // player.socket = socket;
    //
    // player.setBornPosition(gameMap);
    // player.showCylinder(scene);
    //
    // player.camera = camera;
    // mouseController = new MouseController(player, scene);
    //
    // keyController = new KeyController(player, scene);
    // collisionController = new CollisionController(keyController, scene);

    //let yawObject = mouseController.getObject();


    //fp_mesh.add(yawObject);
    /*
    let player = new TestPlayer("id", "name");

    console.log(player.model);

    player.addToScene( scene, 0, 0, 0);
    */

    //keyController = new KeyController(player, scene);
    // collisionController = new CollisionController(keyController, scene);
    //scene.add(fp_mesh);
}

function initPointerLock() {
    //实现鼠标锁定的教程地址 http://www.html5rocks.com/en/tutorials/pointerlock/intro/
    let havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
    if (havePointerLock) {
        let element = document.body;
        let pointerlockchange = function (event) {
            if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
                //controlsEnabled = true;
                mouseController.enabled = true;
                //blocker.style.display = 'none';
            } else {
                mouseController.enabled = false;
                blocker.style.display = 'block';
                instructions.style.display = '';
            }
        };

        let pointerlockerror = function (event) {
            instructions.style.display = '';
        };

        // 监听变动事件
        document.addEventListener('pointerlockchange', pointerlockchange, false);
        document.addEventListener('mozpointerlockchange', pointerlockchange, false);
        document.addEventListener('webkitpointerlockchange', pointerlockchange, false);
        document.addEventListener('pointerlockerror', pointerlockerror, false);
        document.addEventListener('mozpointerlockerror', pointerlockerror, false);
        document.addEventListener('webkitpointerlockerror', pointerlockerror, false);
        instructions.addEventListener('click', function (event) {
            instructions.style.display = 'none';
            //全屏
            //launchFullScreen(renderer.domElement);
            // 锁定鼠标光标
            element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
            element.requestPointerLock();
        }, false);
    }
    else {
        instructions.innerHTML = '你的浏览器不支持相关操作，请更换浏览器';
    }

    function launchFullScreen(element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        }
        else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        }
        else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        }
        else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }
}

function animate() {


    let delta = clock.getDelta();

    Player.update(delta);
    keyController.update(delta);
    mouseController.update();
    collisionController.adjust();
    socket.emit('updatePlayer', player.toObject());

    renderer.render(scene, scene.camera);
    render_stats.update();
    requestAnimationFrame(animate);
}



//对场景进行初始化（包括场景中的其他人物）
socket.on('init', data => {
    console.log(data);

    //let camp = (data.terroristNum <= data.counterTerroristNum)? Player.TERRORIST_CAMP: Player.COUNTERTERRORIST_CAMP;
    let camp = data.terroristNum <= data.counterTerroristNum? Player.TERRORIST_CAMP: Player.COUNTERTERRORIST_CAMP;
    let name = "xingyu";
    let index = (camp === Player.TERRORIST_CAMP) ? data.terroristNum : data.counterTerroristNum;

    // player.socketid = socket.id;
    // player.index = index;
    // player.model.playerid = socket.id;
    // player.socket = socket;
    // player.setBornPosition(gameMap);

    //

    player = new Player(socket.id, name, camp, index);
    player.socket = socket;
    player.setBornPosition(gameMap);
    Promise.all([Weapon.initialWeaponModels(), player.initialModel('swat')]).then(results => {



        player.model.visible = false;
        scene.add(player.model);
        mouseController = new MouseController(player, scene);
        keyController = new KeyController(player, scene);
        collisionController = new CollisionController(keyController, scene);
        animate();
        console.log("initial finished!");
        socket.emit('addPlayer', player.toObject());
    });

        // player.camera = camera;

});

//人物添加
socket.on('addPlayer', data => {
    if (!Player.terroristMap.has(data.socketid) && !Player.counterTerroristMap.has(data.socketid)) {
        let newPlayer = new Player(data.socketid, data.name, data.camp, data.index);
        newPlayer.setBornPosition(gameMap);
        newPlayer.initialModel('swat', data.position).then(result => {
            scene.add(newPlayer.model);
        });
        socket.emit('addPlayerSuccess', data);
    }
});

//自己进入后，其他玩家将自己添加成功时，将其进行添加
socket.on('addPlayerSuccess', data => {
    console.log(Player.counterTerroristMap);
    if (!Player.terroristMap.has(data.socketid) && !Player.counterTerroristMap.has(data.socketid)) {
        console.log(data.socketid + ' received my request and now i will add it in my scene');
        let otherPlayer = new Player(data.socketid, data.name, data.camp, data.index);
        otherPlayer.initialModel('swat', data.position).then(result => {
            scene.add(otherPlayer.model);
        });
    }
});

socket.on('updatePlayer', data => {
    let updatePlayer = Player.get(data.socketid);
    if (updatePlayer && updatePlayer.model) {
        updatePlayer.setPosition(data.position);
        updatePlayer.setRotation(data.rotation);
        updatePlayer.action = data.action;
        updatePlayer.firing = data.firing;
    }
});

socket.on('buyRifle', data => {
    console.log(data.socketid + " bought a rifle " + data.rifle);
    Player.get(data.socketid).buyRifle(data.rifle);
});


socket.on('offline', playerInfo => {
    console.log('Player ' + playerInfo.socketid + ' disconnected.\n');
    let offlinePlayer;
    if (Player.terroristMap.has(playerInfo.socketid)) {
        offlinePlayer = Player.terroristMap.get(playerInfo.socketid);
        Player.terroristMap.delete(playerInfo.socketid);
    }
    else if (Player.counterTerroristMap.has(playerInfo.socketid)) {
        offlinePlayer = Player.counterTerroristMap.get(playerInfo.socketid);
        Player.counterTerroristMap.delete(playerInfo.socketid);
    }
    if (offlinePlayer) {
        scene.remove(offlinePlayer.model);
    }
});
/*
socket.on('bullet', function (bullet) {
    console.log(bullet);
    var position = new THREE.Vector3(bullet[0].x, bullet[0].y, bullet[0].z);
    var speed = new THREE.Vector3(bullet[1].x, bullet[1].y, bullet[1].z);
    AddBullet(position, speed, bullet[2]);
});
socket.on('hit', function (data) {
    console.log(data);
    if (id == data.hit) {
        var answer = confirm("You are dead, play again?");
        if (answer) {
            window.location.reload();
        } else {
            window.location = "about:blank";
        }
    } else {
        if (id == data.by) {
            console.log("You killed: " + data.hit);
        }
        scene.remove(players[data.hit]);
    }
});
*/

socket.on('hit', data => {
    console.log(socket.id + ' suffered from' + data.socketid + ' for ' + data.damage);
    player.hp -= data.damage;
    console.log(socket.id + ' left ' + player.hp + ' hp');
    if (player.hp <= 0) {
        player.die(scene, gameMap);
        console.log(socket.id + ' was killed by ' + data.socketid);


        socket.emit('die', {'socketid': data.socketid});
    }
});

socket.on('die', data => {
    Player.get(data.killer).kill();
    Player.get(data.killed).die();
    //右上角显示杀敌信息
});

socket.on('roundOver', data => {
    console.log(data.info);
    Player.terroristWins = data.terroristWins;
    Player.counterTerroristWins = data.counterTerroristWins;
});

socket.on('resetAll', data => {
    Player.resetAll();

});
socket.on('connect', function () {
    console.log('Connected');
});
socket.on('disconnect', function () {
    console.log('Disconnected');
});
socket.on('reconnect', function () {
    console.log('Reconnected to server');
});
socket.on('reconnecting', function (nextRetry) {
    console.log('Attempting to re-connect to the server, next attempt in ' + nextRetry + 'ms');
});
socket.on('reconnect_failed', function () {
    console.log('Reconnected to server FAILED.');
});
