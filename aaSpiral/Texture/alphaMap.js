import * as THREE from '/resources/threejs/r132/build/three.module.js'
import { GUI } from '/resources/threejs/r132/examples/jsm/libs/dat.gui.module.js';

//scenus
const scenus = new THREE.Object3D();


const loader = new THREE.TextureLoader();
const textures = {};
const names =  [];
for (let i = 0; i < 6; i++) {
    names[i] = 't'+(i+1)
    textures[names[i]] = loader.load('/aaSpiral/Texture/img/transition'+(i+1)+'.png')
}
names.push('t7')
textures['t7'] =loader.load('/aaSpiral/Texture/img/alphaMap.jpg');

const map = loader.load('/aaSpiral/Texture/img/parent.JPG');
const sphereMat = new THREE.MeshPhongMaterial({map , alphaTest: 0.15, alphaMap : textures['t3'] ,side: THREE.DoubleSide });
const sphereGeo = new THREE.BoxGeometry(1,1.5,1);
const sphere = new THREE.Mesh(sphereGeo, sphereMat);
scenus.add(sphere);

//GUI
const gui = new GUI();
const c = { 
    name : "t3"
}
gui.domElement.style.display = 'none';
gui.add(sphereMat, 'alphaTest', 0, 1, 0.01).onChange(() => {
});
gui.add(sphereMat, 'wireframe').onChange(() => {
    // sphereMat.opacity = guiConf.opacity;
});

gui.add(c, 'name',names).onChange( () => {
    
    sphereMat.needsUpdate = true;
    sphereMat.alphaMap = textures[c.name];
});
//context
let canAnim = false;
const context = {
    init: function () { },
    scenus,
    animus: (time, renderer, scene, camera) => {
        if (!canAnim) return;
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





