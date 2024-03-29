import * as THREE from '../../resources/threejs/r132/build/three.module.js'

class SpiralOfObject {

    
    #collector = [];

    #accuIncrement = 0;
    #progress = 0;
    #N = 7
    #alpha = (2 * Math.PI) / this.#N
    #beta =  this.#collector.length *  this.#alpha;
    #H = 20;
    #h =0
    #r = 20;
    constructor(options) {

        this.setOptions(options);
        this.scenus = new THREE.Object3D();
        this.index = 0;

    }
    setOptions(options) {
        if (options?.spireHeight) this.#H = options.spireHeight;
        if (options?.radius) this.#r = options.radius;
        if (options?.spireLength) this.#N = options.spireLength;
    }
    push(obj) {
        this.#beta = this.#collector.length * this.#alpha;
        this.#h = this.#H * (this.#collector.length / this.#N)
        obj.position.set(this.#r * Math.sin(this.#beta), this.#h, this.#r * Math.cos(this.#beta));
        this.scenus.add(obj);
        this.#collector.push(obj);
    }
    progress(value) {
        if(value !== undefined) this.#accuIncrement = value;
        return this.#accuIncrement;
    }
    back() {
        this.#accuIncrement -= this.#H / this.#N
        this.select();
    }
    next() {
        this.#accuIncrement += this.#H / this.#N
        this.select();
    }
    select() {
        let i = this.#N * (this.#accuIncrement / this.#H);
        i = Math.round(i);
        this.index = i;
        this.#accuIncrement = this.#H * (i / this.#N);
    }
    selectIndex(i) {
        this.#accuIncrement = this.#H * (i / this.#N);
    }
    refreshSpiral() {
        const a = this.#accuIncrement;
        const maxAcc = this.#H * (this.#collector.length / this.#N);
        this.#accuIncrement = a >this.#H * (this.#collector.length / this.#N) ? maxAcc : a < 0 ? 0 : a;
        this.scenus.rotation.y = -(this.#progress / 20) * 2 * Math.PI;
        this.scenus.position.y = -this.#progress;
    }
    update() {
        this.#progress += (this.#accuIncrement - this.#progress) * 0.05;
        this.refreshSpiral();
    }
}


export default SpiralOfObject;









