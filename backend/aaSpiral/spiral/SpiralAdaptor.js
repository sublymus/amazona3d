import * as THREE from '../../resources/threejs/r132/build/three.module.js'
import SpiralOfObject from './SpiralOfObject.js'

class SpiralAdaptor {


    constructor(options) {
        this.options = options;
        this.disposeRequired = true;
        this.defaultPosition = new THREE.Vector3(0, 0, 23.5);
        this.onCheking = true;
        this.moveIncrement = 0;
        this.spiral = new SpiralOfObject(options);
        this.tactileEnabled = false;
        options.container.addEventListener('mousemove', this.tactile(e => {

            let x;
            x = e.clientX / (options.renderer.domElement.clientWidth);
            x -= 0.5;
            this.moveIncrement = x * 0.1 // x - Math.atan(x);
        }));
        options.container.addEventListener('click',this.tactile( e => {
            this.select()
        }));
        const fun = {
            back: () => {
                this.spiral.back();
                this.select();
            },
            next: () => {
                this.spiral.next();
                this.select();
            },
            door: () => {
                this.chek(!this.onCheking);
                if (this.onCheking) this.select();
            },
            loupe: () => {
                this.disposeRequired =true;
            }
        }
        document.body.querySelector('.back').addEventListener('click',this.tactile(fun.back));
        document.body.querySelector('.next').addEventListener('click', this.tactile(fun.next));
        document.body.querySelector('.door').addEventListener('click', this.tactile(fun.door));
        document.body.querySelector('.loupe').addEventListener('click', this.tactile(fun.loupe));
        document.addEventListener("keydown",this.tactile( (key) => {
    
            let k = key.key;
            //console.log("."+k+"." );
            if (k == "ArrowRight")fun.next();
            if(k == "ArrowLeft")fun.back();
            if(k == " ")fun.door ();
            if(k == "ArrowUp")this.disposeRequired =true;
            //if(k == "ArrowLeft")fun.back();
    
        }));
    
    }

    disposeCamera() {
        const p = this.options.camera.position;
        const v = 0.08
        p.x += (this.defaultPosition.x - p.x) *v;
        p.y += (this.defaultPosition.y - p.y) *v;
        p.z += (this.defaultPosition.z - p.z) * v;
        //console.log(defaultPosition.distanceTo(camera.position));
        if (this.defaultPosition.distanceTo(p) < 0.04) {
            this.disposeRequired = false;
        }
    }


    select() {
        this.chek(true);
        this.spiral.select();
    }

    chek(value) {
        this.onCheking = value;
        const doorElem = document.body.querySelector('.door');
        if (this.onCheking) doorElem.classList.add('closed');
        else doorElem.classList.remove('closed');
    }


    update() {
        if (!this.onCheking) {
            this.spiral.progress(this.spiral.progress() + this.moveIncrement);
        }
        this.spiral.update();
        if (this.disposeRequired) {
            this.disposeCamera();
        }
    }
    tactile(fun) {
       return  (...args) =>{if(this.tactileEnabled) fun(...args)}
    }
}


export default SpiralAdaptor;









