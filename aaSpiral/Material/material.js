import * as THREE from '../../resources/threejs/r132/build/three.module.js'


let contexts = [];
const init = function (renderer) {
    {

        const scenus = new THREE.Object3D();
       
        const sphereGeo = new THREE.SphereGeometry(1, 32, 16);
        const rt = new THREE.WebGLCubeRenderTarget(512);
        rt.texture.type = THREE.FloatType
        const cubeCamera = new THREE.CubeCamera(0.1, 10_000, rt);
        const mat = new THREE.MeshPhongMaterial({ color: '#FFFFFF', envMap: rt.texture })
        scenus.add(new THREE.Mesh(sphereGeo, mat));



        const cubeGeo = new THREE.BoxGeometry(1, 1);
        const cubeMat = new THREE.MeshPhongMaterial({ color: '#FFFFFF', shininess: 0.3 })
        const cube = new THREE.Mesh(cubeGeo, cubeMat);
        scenus.add(cube);
        contexts.push({
            init:(renderer, scene, camera) => {
                
            },
            scenus,
            animus : (time, renderer, scene, camera) => {
                cubeCamera?.update(renderer, scene);
                const r = 3;
                cube.position.set(r * Math.sin(time), r * Math.sin(time * 2), r * Math.cos(time))
                cube.rotation.set(time, time, time);
            }
        });
    }
    
}
contexts.init = init;
export { contexts }