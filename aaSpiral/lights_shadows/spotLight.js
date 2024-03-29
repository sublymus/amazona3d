import * as THREE from '/resources/threejs/r132/build/three.module.js'
import { GUI } from '/resources/threejs/r132/examples/jsm/libs/dat.gui.module.js';

let context;

//scenus
const scenus = new THREE.Object3D();


const planeSize = 4;

const loader = new THREE.TextureLoader();
const texture = loader.load('/aaSpiral/lights_shadows/FloorsCheckerboard_S_Diffuse.jpg');
const normalTexture = loader.load('/aaSpiral/lights_shadows/FloorsCheckerboard_S_Normal.jpg');


////////////////////////////
const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
const planeMat = new THREE.MeshStandardMaterial({
    map: texture,
    side: THREE.DoubleSide,
    //normalMap : normalTexture
});
const mesh = new THREE.Mesh(planeGeo, planeMat);
mesh.rotation.x = Math.PI * -.5;
mesh.position.y = -.51;
scenus.add(mesh);
{
    const cubeSize = 1;
    const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const cubeMat = new THREE.MeshStandardMaterial({ color: '#8AC' });
    const mesh = new THREE.Mesh(cubeGeo, cubeMat);
    mesh.position.set(1, .001, 0);
    scenus.add(mesh);
}
{
    const sphereRadius = 1;
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 16;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
    const sphereMat = new THREE.MeshStandardMaterial({ color: '#CA8' });
    const mesh = new THREE.Mesh(sphereGeo, sphereMat);
    mesh.position.set(- 1, 1, 0);
    scenus.add(mesh);

}

const gui = new GUI();
gui.domElement.style.display = 'none';

const color = 0x2ff016;
const intensity = 2;
const light = new THREE.SpotLight(color, intensity,0.15);

//scenus.add(light);

light.distance = 5;
light.angle = Math.PI / 6;
light.penumbra = 0.25;
const helper = new THREE.SpotLightHelper(light);

const cam = light.shadow.camera;
const camHelper = new THREE.CameraHelper(cam);
scenus.add(helper);

function updateLight() {
    light.target.updateMatrixWorld(); 
    helper.update();
}
updateLight();
const targetGeo = new THREE.SphereGeometry(0.2, 10, 5);
const targetMat = new THREE.MeshPhongMaterial({ color: '#CA8' });
const target = new THREE.Mesh(targetGeo, targetMat);
scenus.add(target);


//GUI
const c = {
    color: '#FFFF00',
    rotation: 2.73,
    height: 2.2,
    radius: 1
}

const folder = gui.addFolder('- PointLight');
folder.open();
const colorSetter = () => {
    light.color.set(c.color);
    //helperMat.color.set(c.color);
}
colorSetter();
const dispose = () => {

    scenus.getWorldPosition(context.position);

    light.position.x = context.position.x + c.radius * Math.sin(c.rotation);
    light.position.z = context.position.z + c.radius * Math.cos(c.rotation);
    light.position.y = context.position.y + c.height;
    light.target.position.set(context.position.x, context.position.y, context.position.z);
    updateLight();
};
folder.addColor(c, 'color').onChange(colorSetter);
folder.add(light, 'intensity', 0, 2, 0.01);
folder.add(light, 'distance', 0, 5, 0.1);
folder.add(light, 'decay', 0, 1, 0.01);
folder.add(light, 'angle', 0, Math.PI*.5, 0.01);
folder.add(light, 'penumbra', 0,1, 0.01);
folder.add(c, 'rotation', 0, Math.PI * 2, 0.01);
folder.add(c, 'height', -.5, 4, 0.01);
folder.add(c, 'radius', 0, 4, 0.01);


//context
let canAnim = false;
context = {
    position: new THREE.Vector3(0, 0, 0),
    init: function (renderer, scene, camera) {
        this.scene = scene;
        scene.add(light);
        scene.add(helper);
        //scene.add(camHelper);
     },
    scenus,
    animus: (time, renderer, scene, camera) => {
        dispose();
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





