import * as THREE from '/resources/threejs/r132/build/three.module.js'
import { GUI } from '/resources/threejs/r132/examples/jsm/libs/dat.gui.module.js';

//scenus
const scenus = new THREE.Object3D();


const loader = new THREE.TextureLoader();
const map = loader.load('../Texture/img/Rock026_1K_Color-min.jpg');
const displacementMap = loader.load('../Texture/img/Rock026_1K_Displacement.jpg');
const roughnessMap = loader.load('../Texture/img/Rock026_1K_Roughness-min.png');
const normalMap = loader.load('../Texture/img/Rock026_1K_NormalDX-min.jpg');
const sphereMat = new THREE.MeshPhongMaterial({ map, displacementMap, normalMap, roughnessMap});
const sphereGeo = new THREE.IcosahedronGeometry(0.25,6);
const sphere = new THREE.Mesh(sphereGeo, sphereMat);
scenus.add(sphere);

//GUI
const gui = new GUI();

gui.domElement.style.display = 'none';
sphereMat.displacementScale = 1
gui.add(sphereMat, 'displacementScale', 0, 4, 0.1).onChange(() => {
   // sphereMat.opacity = guiConf.opacity;
});
gui.add(sphereMat, 'displacementBias', 0, 2, 0.1).onChange(() => {
   // sphereMat.opacity = guiConf.opacity;
});
gui.add(sphereMat, 'wireframe').onChange(() => {
   // sphereMat.opacity = guiConf.opacity;
});

//context
let canAnim = false;
const context = {
    init: function () { },
    scenus,
    animus: (time, renderer, scene, camera) => {
        if(!canAnim) return;
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





