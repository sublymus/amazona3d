import * as THREE from '/resources/threejs/r132/build/three.module.js'
import { GUI } from '/resources/threejs/r132//examples/jsm/libs/dat.gui.module.js';

//scenus
const scenus = new THREE.Object3D();
const lod =new THREE.LOD();
const sphereMat = new THREE.MeshPhongMaterial({ wireframe: true });
const length = 4;
for (let i = 0; i < length; i++) {

    const sphereGeo = new THREE.IcosahedronGeometry(2, i+1);
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    lod.addLevel(sphere,(length-i)*3);
}
scenus.add(lod);
//GUI
const gui = new GUI();

gui.domElement.style.display = 'none';

const guiConf = {
    wireframe: true,
    wireframeLinecap: 'round',
    wireframeLinejoin: 'round',
    wireframeLinewidth: 1,
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
       console.log( lod.getCurrentLevel ());
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
    name : "LOD",
    hint : ' +zoom / -zoom  or -zoom +focus',
    note:[
        'le LOD est un groupe dont les Object3D sont visible selon la distance par rapport a la camera',
        'pour optimiser le rendu, quand la camera s\'seloigne, la mesh de l\'objet perd en densité '
    ]
};


export { context };





