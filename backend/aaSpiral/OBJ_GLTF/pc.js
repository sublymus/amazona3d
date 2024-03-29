import * as THREE from '../../resources/threejs/r132/build/three.module.js'
import { GUI } from '../../resources/threejs/r132/examples/jsm/libs/dat.gui.module.js';
import { GLTFLoader } from '../../resources/threejs/r132/examples/jsm/loaders/GLTFLoader.js';


//GUI
const gui = new GUI();

gui.domElement.style.display = 'none';

const c = {
    emissive: 0xcccccc,//pc
    color: 0xffffff,//pc
    tactilColor :0xffffff,
}
//scenus
const scenus = new THREE.Object3D();

let scene;

const loader = new GLTFLoader();
let screenPivot;
let tactile
loader.load('../../resources/models/blender/pc/pc.glb ', (gltf) => {
    const root = gltf.scene;
    scenus.add(root);
    root.position.y = -0.5;
    root.rotation.y = Math.PI;
    screenPivot = root.getObjectByName("screenPivot");
    tactile = root.getObjectByName("Cube002");
    const pc = root.getObjectByName("Cube002_1");
    const keypad = root.getObjectByName("Cube061");
    const keypad2 = root.getObjectByName("Cube061_1");
    
    ////
    const f1 = gui.addFolder('PC');
    pc.material.color = new THREE.Color("#556677");
    pc.material.roughness = 0.8;
    pc.material.metalness = 0.4;
    f1.add(pc.material, 'metalness', 0, 1, 0.1);
    f1.add(pc.material, 'roughness', 0, 1, 0.1);
    f1.add(pc.material, 'emissiveIntensity', 0, 1, 0.01);
    f1.add(pc.material, 'emissiveIntensity', 0, 1, 0.01);
    f1.addColor(c, 'emissive').onChange(() => {
        pc.material.emissive = new THREE.Color(c.emissive);
    });
    f1.addColor(c, 'color').onChange(() => {
        pc.material.color = new THREE.Color(c.color);
    });
    //// 
    const  f2 = gui.addFolder('keyLight');
    keypad.material.emissive =  new THREE.Color(c.emissive);
    f2.addColor(c, 'emissive').onChange(() => {
        keypad.material.emissive = new THREE.Color(c.emissive);
        keypad2.material.emissive = new THREE.Color(c.emissive);
    });

    ////
    const f4 = gui.addFolder('keyPad');
    keypad2.material.emissiveMap =  keypad2.material.map;
    keypad2.material.color =  new THREE.Color(c.color);
    keypad2.material.emissive = new THREE.Color(c.emissive);
    keypad2.material.roughness = 0.8;
    keypad2.material.metalness = 0.2;
    //
    const video = document.getElementById('video');
    console.log(video);
    video.style.width = '500px';
    //video.play();
    video.addEventListener('play', function () {

        this.currentTime = 3;

    });

    const texture = new THREE.VideoTexture(video);


    //
    const f5 = gui.addFolder('screen');
    tactile.material.color = new THREE.Color("#FFFFFF");
    tactile.material.emissive = new THREE.Color("#FFFFFF");
    tactile.material.metalness = 1;
    tactile.material.roughness = 0;
    tactile.material.emissiveIntensity = 0.8;
    tactile.material.envMap = scene.background;
    tactile.material.map = texture;
    tactile.material.needsUpdate = true;
    tactile.material.emissiveMap = texture;
    f5.add(tactile.material, 'metalness', 0, 1, 0.1)
    f5.add(tactile.material, 'roughness', 0, 1, 0.1)
    f5.add(tactile.material, 'emissiveIntensity', 0, 1, 0.01).name('light');
    f5.addColor(c, 'tactilColor').name('color').onChange(() => {
        tactile.material.emissive = new THREE.Color(c.tactilColor);
        tactile.material.color = new THREE.Color(c.tactilColor);
    });

    //
    const f3 = gui.addFolder('video')
    texture.repeat.x = 4;
    texture.repeat.y = 4;
    texture.offset.x = 0.5;
    texture.offset.y = 1;
    texture.center.x = 0.5;
    texture.center.y = 0.5;
    texture.rotation = Math.PI / 2;
    f3.add(texture.repeat, 'x', .25, 4, 0.01).name('repeat.x');
    f3.add(texture.repeat, 'y', .25, 4, 0.01).name('repeat.y');
    f3.add(texture.offset, 'x', -4, 4, 0.01).name('offset.x');
    f3.add(texture.offset, 'y', -4, 4, 0.01).name('offset.y');
    f3.add(texture.center, 'x', 0, 1, 0.01).name('center.x');
    f3.add(texture.center, 'y', 0, 1, 0.01).name('center.y');
    f3.add(texture, 'rotation', 0, Math.PI / 2, 0.01);
});

//context
let canAnim = false;
const context = {
    init: function (renderer, p_scene, camera) {
        scene = p_scene;
    },
    scenus,
    animus: (time, renderer, scene, camera) => {
        if (!canAnim) return;
        screenPivot.rotation.x = Math.abs(Math.atan(Math.tan(time * 0.1))) / 2;
    },
    gui,
    onClose: () => {
        canAnim = false;
        gui.domElement.style.display = 'none';
    },
    onOpen: () => {
        canAnim = true;
        gui.domElement.style.display = 'inherit';
    },
};

export { context };





