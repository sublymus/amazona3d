import * as THREE from '../../../resources/threejs/r132/build/three.module.js'
import { OrbitControls } from '../../../resources/threejs/r132/examples/jsm/controls/OrbitControls.js'
import {context as wireframe} from '../Material/wireFrame.js'
import {contexts as material} from '../Material/material.js'
import {context as flatShading } from "../Material/flatShading.js";
import {context as opacity} from '../Material/opacity.js'
import {context as fog} from '../Material/fog.js'
import {FocusLight } from "../lights_shadows/focusLight.js";
import {context as pointLight } from "../lights_shadows/pointLigth.js";
import {context as spotLight } from "../lights_shadows/spotLight.js";
import {context as shadow } from "../lights_shadows/shadow.js";
import {context as texture } from "../Texture/texture.js";
import {context as normalMap } from "../Texture/normalMap.js";
import {context as displacementMap } from "../Texture/displacementMap.js";
import {context as emissiveMap } from "../Texture/emissiveMap.js";
import {context as alphaMap } from "../Texture/alphaMap.js";
import {context as lod } from "../Geometry/lod.js";
import  SpiralAdaptor from "../spiral/SpiralAdaptor.js";
const SpiralScene = {
    contexts :[],
    lastIndex: -1,
    actualIndex: 0,
    opened: false,
    onClose(){
        this.open = false;
        this.spiralAdaptor.tactileEnabled=false;
        this.controls.enabled = false
        this.contexts[this.actualIndex].onClose?.();
    },
    onOpen(){
        this.open = true;
        this.spiralAdaptor.tactileEnabled=true;
        this.controls.enabled = true;
        this.contexts[this.actualIndex].onOpen?.();
    },
    init : function (renderer){
        
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 10_000)
        
        this.controls = new OrbitControls(this.camera, renderer.domElement)
        this.controls.target.z = 20;
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('#333');
    
        this.scene.add(new THREE.AmbientLight(0xffffff, 0.5))
        
        this.spiralAdaptor = new SpiralAdaptor({
            container : renderer.domElement.parentElement,
            renderer,
            camera: this.camera,
        }) ;
        this.scene.add(this.spiralAdaptor.spiral.scenus);

        material.init(renderer, this.scene, this.camera);
        this.focusLight = new FocusLight(10)
        this.focusLight.init(this.scene);

        
       this.contexts.push(wireframe);
       this.contexts.push(lod);
        this.contexts.push(flatShading);
        this.contexts.push(opacity);
        this.contexts.push(fog);
        this.contexts.push(pointLight);
        this.contexts.push(spotLight);
        this.contexts.push(shadow);
        this.contexts.push(texture);
        this.contexts.push(normalMap);
        this.contexts.push(displacementMap);
         this.contexts.push(emissiveMap);
         this.contexts.push(alphaMap);
        this.contexts.push(...material);

        this.contexts.forEach(context=>{
            context.init(renderer,this.scene, this.camera);
        });

        this.contexts.forEach((context) => {
            this.spiralAdaptor.spiral.push(context.scenus);
        });
        
    },
    animus  :function (time , renderer){
       
    this.spiralAdaptor.update();
    this.select(this.spiralAdaptor.spiral.index);

    this.controls.update();

        this.contexts.forEach(context=>{
            context.animus(time , renderer,this.scene, this.camera);
        });
        this.focusLight.animus(time , renderer,this.scene, this.camera);
    },
    select : function (index){
        index = index<0 ? 0 : index>=this.contexts.length ? this.contexts.length -1 :index;
        this.moveLight(index);
        if(index == this.lastIndex) return
        this.lastIndex = this.actualIndex;
        this.actualIndex = index; 
        this.contexts[this.lastIndex].onClose?.();
        this.contexts[index].onOpen?.();

    },
    moveLight : function(index){
       
        this.contexts[index].scenus.getWorldPosition(this.focusLight.position)
       
    }

};

export default SpiralScene;




