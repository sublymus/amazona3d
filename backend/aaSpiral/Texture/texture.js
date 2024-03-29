import * as THREE from '../../resources/threejs/r132/build/three.module.js'
import { GUI } from '../../resources/threejs/r132/examples/jsm/libs/dat.gui.module.js';

//scenus
const scenus = new THREE.Object3D();


const planeSize = 4;

const loader = new THREE.TextureLoader();
const texture = loader.load('../Texture/img/hardwood2_diffuse.jpg');
const boxtexture = loader.load('../../resources/images/wall.jpg');
const roughnessMap = loader.load('../Texture/img/hardwood2_roughness.jpg');
const bumpMap = loader.load('../Texture/img/hardwood2_bump.jpg');

boxtexture.needsUpdate = true;
boxtexture.magFilter = THREE.LinearMipmapLinearFilter;
boxtexture.minFilter = THREE.LinearMipmapLinearFilter;
////////////////////////////
const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
const planeMat = new THREE.MeshStandardMaterial({
    map: texture,
    side: THREE.DoubleSide,
    roughnessMap: roughnessMap,
    bumpMap: bumpMap
});
const mesh = new THREE.Mesh(planeGeo, planeMat);
mesh.rotation.x = Math.PI * -.5;
mesh.position.y = -.51;
scenus.add(mesh);

{
    const cubeSize = 1;
    const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const cubeMat = new THREE.MeshPhongMaterial({ color: '#8AC', map: boxtexture });
    const mesh = new THREE.Mesh(cubeGeo, cubeMat);
    mesh.position.set(0, .001, 0);
    scenus.add(mesh);
}

const gui = new GUI();
gui.domElement.style.display = 'none';
{
    const color = 0x00c0ff;
    const intensity = 2;
    const light = new THREE.PointLight(color, intensity);
    light.distance = 3;
    scenus.add(light);

    const helperGeo = new THREE.SphereGeometry(0.1, 10, 5);
    const helperMat = new THREE.MeshBasicMaterial({ color: '#CA8' });
    const helper = new THREE.Mesh(helperGeo, helperMat);
    scenus.add(helper);


    //GUI
    const c = {
        color: '#FFFFFF',
        angle: 5.5,
        height: -.4,
        radius: 1,
        wrapS: 'ClampToEdgeWrapping',
        wrapT: 'ClampToEdgeWrapping'
    }

    const folder = gui.addFolder('- PointLight');
    const colorSetter = () => {
        light.color.set(c.color);
        helperMat.color.set(c.color);
    }
    colorSetter();
    folder.addColor(c, 'color').onChange(colorSetter);
    folder.add(light, 'intensity', 0, 2, 0.01);
    folder.add(light, 'distance', 0, 5, 0.1);
    folder.add(light, 'decay', 0, 1, 0.01);
    const dispose = () => {
        light.position.x = c.radius * Math.sin(c.angle);
        light.position.z = c.radius * Math.cos(c.angle);
        helper.position.x = c.radius * Math.sin(c.angle);
        helper.position.z = c.radius * Math.cos(c.angle);
        light.position.y = c.height;
        helper.position.y = c.height;
    };

    folder.add(c, 'angle', 0, Math.PI * 2, 0.01).onChange(dispose);
    folder.add(c, 'height', -.5, 1, 0.01).onChange(dispose);
    folder.add(c, 'radius', 0, 3, 0.001).onChange(dispose);
    dispose();

    const f2 = gui.addFolder('texture Support');

    f2.add(c, 'wrapS', ['ClampToEdgeWrapping', 'RepeatWrapping', 'MirroredRepeatWrapping']).onChange(() => {
        
        texture.needsUpdate = true;
        texture.wrapS = THREE[c.wrapS];
        roughnessMap.needsUpdate = true;
        roughnessMap.wrapS = THREE[c.wrapS];
        bumpMap.needsUpdate = true;
        bumpMap.wrapS = THREE[c.wrapS];
    });
    f2.add(c, 'wrapT', ['ClampToEdgeWrapping', 'RepeatWrapping', 'MirroredRepeatWrapping']).onChange(() => {
        texture.needsUpdate = true;
        texture.wrapT = THREE[c.wrapT];
        roughnessMap.needsUpdate = true;
        roughnessMap.wrapT =THREE[c.wrapT];
        bumpMap.needsUpdate = true;
        bumpMap.wrapT = THREE[c.wrapT];
    });
    f2.add(bumpMap.repeat, 'x', .25, 4, 0.01).onChange(() => {
        
        roughnessMap.repeat.x = texture.repeat.x =bumpMap.repeat.x;
        
    });
    f2.add(bumpMap.repeat, 'y', .25, 4, 0.01).onChange(() => {

        roughnessMap.repeat.y =texture.repeat.y =  bumpMap.repeat.y ;
    });

    const f3 = gui.addFolder('texture Box');
   
    f3.add(c, 'wrapS', ['ClampToEdgeWrapping', 'RepeatWrapping', 'MirroredRepeatWrapping']).onChange(() => {
        boxtexture.wrapS = THREE[c.wrapS];
        boxtexture.needsUpdate = true;
    });
    f3.add(c, 'wrapT', ['ClampToEdgeWrapping', 'RepeatWrapping', 'MirroredRepeatWrapping']).onChange(() => {
        boxtexture.wrapT = THREE[c.wrapT];
        boxtexture.needsUpdate = true;
    });
    f3.add(boxtexture.repeat, 'x', .25, 4, 0.01).name('repeat.x');
    f3.add(boxtexture.repeat, 'y', .25, 4, 0.01).name('repeat.y');
    f3.add(boxtexture.offset, 'x', -4, 4, 0.01).name('offset.x');
    f3.add(boxtexture.offset, 'y', -4, 4, 0.01).name('offset.y');
    f3.add(boxtexture.center, 'x', 0, 1, 0.01).name('center.x');
    f3.add(boxtexture.center, 'y', 0, 1, 0.01).name('center.y');
    f3.add(boxtexture,'rotation', 0,Math.PI*2, 0.01);

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





