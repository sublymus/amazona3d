import * as THREE from '/resources/threejs/r132/build/three.module.js'
import { GUI } from '/resources/threejs/r132/examples/jsm/libs/dat.gui.module.js';

let context;
//scenus
const scenus = new THREE.Object3D();

const sphereMat = new THREE.MeshPhongMaterial({
    color : "#ffffff", transparent : true ,  opacity :.5});
const sphereGeo = new THREE.IcosahedronGeometry(1,2);
const sphere = new THREE.Mesh(sphereGeo, sphereMat);
scenus.add(sphere);

const cubeMat = new THREE.MeshPhongMaterial({color : "#334455"});
const cubeGeo = new THREE.BoxGeometry(.3,.3,.3);
const cube = new THREE.Mesh(cubeGeo, cubeMat);
scenus.add(cube);

//GUI
const gui = new GUI();

gui.domElement.style.display = 'none';
const fog = new THREE.Fog('#FFFFFF',0.1,50);
const fogExp2 = new THREE.FogExp2('#FFFFFF',0.1);
const guiConf = {
    'scene.fog': true,
    Fog : function(){
        context.scene.fog = fog;
        context.scene.background =  new THREE.Color(guiConf.fogColor);
    },
    near : 0.1,
    far:50,
    FogExp2 : function(){
        context.scene.fog = fogExp2;
        context.scene.background =  new THREE.Color(guiConf.fogColor);
    },
    density :0.1,
    none : function(){
        context.scene.fog = undefined;
        context.scene.background = guiConf.lastSceneColor;
    },
    opacity: 0.5,
    visible: true,
    flatShading : false,
    side:'FrontSide',
    color : '#FFFFFF',
    fogColor : '#FFFFFF',
    lastSceneColor : '#FFFFFF'
}
gui.add(guiConf, 'Fog').onChange(() => {
   guiConf['Fog']();
});

gui.add(guiConf, 'near', 0, 10).onChange(() => {
    fog.near = guiConf.near;
});

gui.add(guiConf, 'far', 10, 100).onChange(() => {
    fog.far = guiConf.far;
});

gui.add(guiConf, 'FogExp2').onChange(() => {
   guiConf['FogExp2']();
});
gui.add(guiConf, 'density', 0, .5, 0.01).onChange(() => {
    fogExp2.density = guiConf.density;
});

gui.add(guiConf, 'none').onChange(() => {
   guiConf.none();
});

gui.add(guiConf, 'opacity', 0, 1, 0.1).onChange(() => {
    sphereMat.opacity = guiConf.opacity;
});

gui.add(guiConf, 'visible').onChange(() => {
    sphereMat.visible = guiConf.visible;
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
gui.addColor(guiConf, 'fogColor').onChange(() => {
    const c =  new THREE.Color(guiConf.fogColor);
    fog.color = c; 
    fogExp2.color = c; 
    context.scene.background = c;
});
//context
let canAnim = false;

context = {
    init: function ( renderer, scene, camera) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
     },
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
        
        console.log( canAnim);
        guiConf.lastSceneColor = context.scene.background;
        gui.domElement.style.display = 'inherit';
        canAnim = true;
    },
};

export { context };





