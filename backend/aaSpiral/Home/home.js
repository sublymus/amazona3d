import * as THREE from '../../resources/threejs/r132/build/three.module.js'
import Stats from '../../resources/threejs/r132/examples/jsm/libs/stats.module.js'
import RenderManager from './Manager/renderManager.js'
let renderer, camera, scene, stats;


init();

function init() {

    renderer = new THREE.WebGL1Renderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animation);
    renderer.shadowMap.enabled = true;
    const container = document.body.querySelector('.container');

    container.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResized);

    stats = new Stats();
    document.body.appendChild(stats.dom);

    RenderManager.init(renderer);
}
function onWindowResized() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    RenderManager.camera.aspect = window.innerWidth / window.innerHeight;
    RenderManager.camera.updateProjectionMatrix();
}

function animation(time) {
    time *= 0.001;
    stats.update();
    RenderManager.animation(time, renderer);
    renderer.render(RenderManager.scene, RenderManager.camera);
}








