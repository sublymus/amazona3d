import * as THREE from '../../resources/threejs/r132/build/three.module.js'
import { GUI } from '../../resources/threejs/r132//examples/jsm/libs/dat.gui.module.js';

//scenus
const scenus = new THREE.Object3D();
const spheres =[]
const sphereMat = new THREE.MeshPhongMaterial({  flatShading : true});

for (let i = 0; i < 4; i++) {

    const sphereGeo = new THREE.IcosahedronGeometry(1, i+1);
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphere.visible = false
    spheres.push(sphere);
    scenus.add(sphere);
}
spheres[0].visible = true

//GUI
const gui = new GUI();

gui.domElement.style.display = 'none';

const guiConf = {
    wireframe : false,
    flatShading : true,
    vertexColors : true,
    detail: 1,
    color : '#FFFFFF',
}


gui.add(guiConf, 'wireframe').onChange(() => {
    sphereMat.wireframe = guiConf.wireframe;
});
gui.add(guiConf, 'flatShading').onChange(() => {
    sphereMat.needsUpdate = true;
    sphereMat.flatShading = guiConf.flatShading;
});
gui.add(guiConf, 'vertexColors').onChange(() => {
    sphereMat.vertexColors = guiConf.vertexColors;
});
gui.add(guiConf, 'detail', 1, 4 , 1).onChange(() => {
   spheres.forEach(sphere=>{
    sphere.visible = false;
   });
   spheres[guiConf.detail-1].visible = true
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





