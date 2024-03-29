import * as THREE from '/resources/threejs/r132/build/three.module.js'
import { GUI } from '/resources/threejs/r132/examples/jsm/libs/dat.gui.module.js';

//scenus
const scenus = new THREE.Object3D();


const cubeMat = new THREE.MeshPhongMaterial({color : "#334455"});
const cubeGeo = new THREE.BoxGeometry(.3,.3,.3);
const cube = new THREE.Mesh(cubeGeo, cubeMat);
scenus.add(cube);

const sphereMat = new THREE.MeshPhongMaterial({
    color : "#ffffff", transparent : true ,  opacity :.5});
const sphereGeo = new THREE.IcosahedronGeometry(1,2);
const sphere = new THREE.Mesh(sphereGeo, sphereMat);
scenus.add(sphere);

//GUI
const gui = new GUI();

gui.domElement.style.display = 'none';

const guiConf = {
    transparent: true,
    opacity: 0.5,
    visible: true,
    depthTest: true,
    depthWrite: true,
    flatShading : false,
    side:'FrontSide',
    color : '#FFFFFF',
}

gui.add(guiConf, 'transparent').onChange(() => {
    sphereMat.transparent = guiConf.transparent;
});
gui.add(guiConf, 'opacity', 0, 1, 0.1).onChange(() => {
    sphereMat.opacity = guiConf.opacity;
});

gui.add(guiConf, 'visible').onChange(() => {
    sphereMat.visible = guiConf.visible;
});
gui.add(guiConf, 'depthTest').onChange(() => {
    cubeMat.depthTest = guiConf.depthTest;
});
gui.add(guiConf, 'depthWrite').onChange(() => {
    cubeMat.depthWrite = guiConf.depthWrite;
});

gui.add(guiConf, 'flatShading').onChange(() => {
    sphereMat.needsUpdate = true;
    sphereMat.flatShading = guiConf.flatShading;
});
gui.add(guiConf, 'side', ['FrontSide', 'BackSide', 'DoubleSide']).onChange(() => {
    sphereMat.side = THREE[guiConf.side];
});
gui.addColor(guiConf, 'color').onChange(() => {
    sphereMat.color.set(guiConf.color)
});
//context
let canAnim = false;
const context = {
    init: function () { },
    scenus,
    animus: (time, renderer, scene, camera) => {
        if(!canAnim) return;
        cube.rotation.set(time,time,time);
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





