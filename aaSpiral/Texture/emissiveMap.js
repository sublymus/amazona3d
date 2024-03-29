import * as THREE from '../../resources/threejs/r132/build/three.module.js'
import { GUI } from '../../resources/threejs/r132/examples/jsm/libs/dat.gui.module.js';

//scenus
const scenus = new THREE.Object3D();


const loader = new THREE.TextureLoader();
const map = loader.load('../Texture/img/Lava005_1K_Color-min.jpg');
const roughnessMap = loader.load('../Texture/img/Lava005_1K_Roughness-min.png');
const displacementMap = loader.load('../Texture/img/Rock026_1K_Displacement.jpg');
const normalMap = loader.load('../Texture/img/Lava005_1K_NormalGL-min.jpg');
const emissiveMap = loader.load('../Texture/img/Lava005_1K_Emission-min.jpg');
const sphereMat = new THREE.MeshPhongMaterial({emissiveMap, map, normalMap, roughnessMap, displacementMap , wireframe: true});
const sphereGeo = new THREE.IcosahedronGeometry(0.5,3);
const sphere = new THREE.Mesh(sphereGeo, sphereMat);
scenus.add(sphere);
//////////
setTimeout(() => {// les image de texture sont charger // Warning image undefined 
map.wrapT = THREE.MirroredRepeatWrapping;
map.wrapS = THREE.MirroredRepeatWrapping;
map.needsUpdate = true;
roughnessMap.wrapT = THREE.MirroredRepeatWrapping;
roughnessMap.wrapS = THREE.MirroredRepeatWrapping;
roughnessMap.needsUpdate = true;
normalMap.wrapT = THREE.MirroredRepeatWrapping;
normalMap.wrapS = THREE.MirroredRepeatWrapping;
normalMap.needsUpdate = true;
emissiveMap.wrapT = THREE.MirroredRepeatWrapping;
emissiveMap.wrapS = THREE.MirroredRepeatWrapping;
emissiveMap.needsUpdate = true;
}, 1000);
console.log(emissiveMap.image);
//GUI
const gui = new GUI();
const c  =  {
    emissive : '#ffffff',
}

gui.domElement.style.display = 'none';
sphereMat.emissiveIntensity = 1;
sphereMat.displacementScale = 1;
sphereMat.emissive = new THREE.Color( c.emissive);
gui.add(sphereMat, 'emissiveIntensity', 0, 1, 0.01).onChange(() => {
   // sphereMat.opacity = guiConf.opacity;
});

gui.addColor(c, 'emissive').onChange(() => {
    sphereMat.emissive = new THREE.Color(c.emissive);
});
gui.add(sphereMat, 'wireframe').onChange(() => {
   // sphereMat.opacity = guiConf.opacity;

console.log(emissiveMap.image);
});

//context
let canAnim = false;
const context = {
    init: function () { },
    scenus,
    animus: (time, renderer, scene, camera) => {
        if(!canAnim) return;
        map.offset.y = time*0.1 ;
        //map.needsUpdate = true;
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





