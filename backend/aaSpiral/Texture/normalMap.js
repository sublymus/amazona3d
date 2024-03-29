import * as THREE from '../../resources/threejs/r132/build/three.module.js'
import { GUI } from '../../resources/threejs/r132/examples/jsm/libs/dat.gui.module.js';

//scenus
const scenus = new THREE.Object3D();


const planeSize = 4;

const loader = new THREE.TextureLoader();
const texture = loader.load('../Texture/img/grasslight-big.jpg');
const boxtexture = loader.load('../Texture/img/crate.gif');
const normalTexture = loader.load('../Texture/img/grasslight-big-nm.jpg');
const normalTexture2 = loader.load('../Texture/img/golfball.jpg');


////////////////////////////
const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
const planeMat = new THREE.MeshStandardMaterial({
    map: texture,
    side: THREE.DoubleSide,
    normalMap : normalTexture
});
const mesh = new THREE.Mesh(planeGeo, planeMat);
mesh.rotation.x = Math.PI * -.5;
mesh.position.y = -.51;
scenus.add(mesh);

{
    const cubeSize = 1;
    const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const cubeMat = new THREE.MeshPhongMaterial({color: '#8AC', map : boxtexture});
    const mesh = new THREE.Mesh(cubeGeo, cubeMat);
    mesh.position.set(1, .001, 0);
    scenus.add(mesh);
}
{
    const sphereRadius = 1;
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 16;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
    const sphereMat = new THREE.MeshStandardMaterial({color: '#CA8' , normalMap : normalTexture2});
    const mesh = new THREE.Mesh(sphereGeo, sphereMat);
    mesh.position.set(- 1, 1, 0);
    scenus.add(mesh);

}

const gui = new GUI();
gui.domElement.style.display = 'none';
{
    const color = 0x00c0ff;
    const intensity = 2;
    const light = new THREE.PointLight(color, intensity);
    light.distance = 1;
    scenus.add(light);

    const helperGeo = new THREE.SphereGeometry(0.1, 10, 5);
    const helperMat = new THREE.MeshBasicMaterial({color: '#CA8'});
    const helper = new THREE.Mesh(helperGeo, helperMat);
    scenus.add(helper);
    
   
    //GUI
    const c = { 
        color : '#FFFFFF',
        angle : 0,
        height : -.4,
        radius : 1
    }

    const folder = gui.addFolder('- PointLight');
    const colorSetter = ()=>{
        light.color.set(c.color);
        helperMat.color.set(c.color);
    }
    colorSetter();
    folder.addColor(c, 'color').onChange(colorSetter);
    folder.add(light, 'intensity', 0, 2, 0.01);
    folder.add(light, 'distance', 0, 5, 0.1);
    folder.add(light, 'decay', 0, 1, 0.01);
    const dispose = ()=>{
        light.position.x = c.radius*Math.sin(c.angle);
        light.position.z = c.radius*Math.cos(c.angle);
        helper.position.x = c.radius*Math.sin(c.angle);
        helper.position.z = c.radius*Math.cos(c.angle);
        light.position.y = c.height;
        helper.position.y = c.height;
    };
   
    folder.add(c, 'angle', 0, Math.PI*2, 0.01).onChange(dispose);
    folder.add(c, 'height', -.5, 1, 0.01).onChange(dispose);
    folder.add(c, 'radius', 0, 3, 0.001).onChange(dispose);
    dispose();
    
}

//context
let canAnim = false;
const context = {
    init: function () { },
    scenus,
    animus: (time, renderer, scene, camera) => {
        if (!canAnim) return;
        //cube.rotation.set(time, time, time);
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





