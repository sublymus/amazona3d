import * as THREE from '../../resources/threejs/r132/build/three.module.js'
import { GUI } from '../../resources/threejs/r132//examples/jsm/libs/dat.gui.module.js';

//scenus
const scenus = new THREE.Object3D();
const spheres =[]
const sphereMat = new THREE.MeshPhongMaterial({ wireframe: true });
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
    wireframe: true,
    wireframeLinecap: 'round',
    wireframeLinejoin: 'round',
    wireframeLinewidth: 1,
    detail: 1,
    color : '#FFFFFF',
}

gui.add(guiConf, 'wireframe').onChange(() => {
    sphereMat.wireframe = guiConf.wireframe;
});
gui.add(guiConf, 'wireframeLinecap', ['butt', 'round', 'square']).onChange(() => {
    sphereMat.wireframeLinecap = guiConf.wireframeLinecap;
});
gui.add(guiConf, 'wireframeLinejoin', ['round', 'bevel', 'mitter']).onChange(() => {
    sphereMat.wireframeLinejoin = guiConf.wireframeLinejoin;
});
gui.add(guiConf, 'wireframeLinewidth', 1, 10, 0.2).onChange(() => {
    sphereMat.wireframeLinewidth = guiConf.wireframeLinewidth;
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





