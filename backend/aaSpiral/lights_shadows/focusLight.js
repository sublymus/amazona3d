import * as THREE from '../../resources/threejs/r132/build/three.module.js'

class FocusLight {
    constructor(length) {
        this.leds = [];
        this.position = new THREE.Vector3(0, 0, 0);
        for (let i = 0; i < length; i++) {
            const led = new THREE.Object3D();

            const color = new THREE.Color();
            color.setHSL(i / length, 1, 0.5);
            const light = new THREE.PointLight(color, 0.6, 5)

            led.add(light);

            const sphereGeo = new THREE.SphereGeometry(0.025, 3, 3);
            const sphereMat = new THREE.MeshBasicMaterial({ color, shininess: 0 })
            const sphere = new THREE.Mesh(sphereGeo, sphereMat);

            const sphereGeo2 = new THREE.SphereGeometry(0.05, 4, 4);
            const sphereMat2 = new THREE.MeshBasicMaterial({ color , transparent: true, opacity : 0.2})
            const sphere2 = new THREE.Mesh(sphereGeo2 ,sphereMat2);
            sphere.add(sphere2);
            led.add(sphere);
            const signe = () => {
                const a = Math.random() * 2 - 1;
                return Math.abs(a) / a

            };
            this.leds.push({
                color,
                light,
                led,
                sphere,
                velocity: {
                    t: 0.7 + Math.random() * .5,
                    x: signe() * (0.1 + Math.random() * .5),
                    y: signe() * (0.1 + Math.random() * .5),
                    z: signe() * (0.1 + Math.random() * .5)
                },
                p: {
                    x: 0,
                    y: 0,
                    z: 0
                }
            })

        }

    }
    animus = (time, renderer, scene, camera) =>{
        const r = 2;
        const v = 0.05;
        time *= 1.7;
        this.leds.forEach((c) => {//conf
            const t = time * c.velocity.t;
            c.p.x += (this.position.x - c.p.x) * v;
            c.p.y += (this.position.y - c.p.y) * v;
            c.p.z += (this.position.z - c.p.z) * v;
            c.led.position.set(
                c.velocity.x + c.p.x + r * Math.cos(time) * Math.sin(time * c.velocity.y),
                c.velocity.y + c.p.y + r * Math.sin(time * c.velocity.x),
                c.velocity.z + c.p.z + r * Math.cos(time) * Math.cos(time * c.velocity.z)
            );
        });
    }
    init =  (scene) => {
        this.leds.forEach(conf => {
            scene.add(conf.led);
        });
    }
}


export { FocusLight }