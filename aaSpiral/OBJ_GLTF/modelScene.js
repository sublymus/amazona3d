import * as THREE from '/resources/threejs/r132/build/three.module.js'
import { OrbitControls } from '/resources/threejs/r132/examples/jsm/controls/OrbitControls.js'
import { context as pcModel } from '/aaSpiral/OBJ_GLTF/pc.js'
import { FocusLight } from "/aaSpiral/lights_shadows/focusLight.js";
import SpiralAdaptor from "/aaSpiral/spiral/SpiralAdaptor.js";

const ModelScene = {
    contexts: [],
    lastIndex: -1,
    actualIndex: 0,
    opened: false,
    onClose() {
        this.open = false;
        this.spiralAdaptor.tactileEnabled = false;
        this.controls.enabled = false
        this.contexts[this.actualIndex].onClose?.();
    },
    onOpen() {
        this.open = true;
        this.spiralAdaptor.tactileEnabled = true;
        this.controls.enabled = true;
        this.contexts[this.actualIndex].onOpen?.();
    },
    init: function (renderer) {

        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 10_000)

        this.controls = new OrbitControls(this.camera, renderer.domElement)
        this.controls.target.z = 20;
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        this.scene = new THREE.Scene();

        const textureLoader = new THREE.TextureLoader();

        const textureEquirec = textureLoader.load('/aaSpiral/Home/img/vs9BtQQ59-HRZ6m_1eDmaNypefBEbzD-Q_MCDmfFGhg.webp');
        textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
        textureEquirec.encoding = THREE.sRGBEncoding;
        this.scene.background = textureEquirec;

        this.scene.add(new THREE.HemisphereLight(0xffffff,0xffddbb, 0.3))
        const light = new THREE.DirectionalLight(0xffffff, 0.8);
        light.position.set(50,20,20);
        this.scene.add(light);

    

      this.spiralAdaptor = new SpiralAdaptor({
            container: renderer.domElement.parentElement,
            renderer,
            camera: this.camera,
        });
        this.scene.add(this.spiralAdaptor.spiral.scenus);

        this.focusLight = new FocusLight(5)
        this.focusLight.init(this.scene);


        this.contexts.push(pcModel);

        this.contexts.forEach(context => {
            context.init(renderer, this.scene, this.camera);
        });

        this.contexts.forEach((context) => {
            this.spiralAdaptor.spiral.push(context.scenus);
        });

    },
    animus: function (time, renderer) {

        this.spiralAdaptor.update();
        this.select(this.spiralAdaptor.spiral.index);

        this.controls.update();

        this.contexts.forEach(context => {
            context.animus(time, renderer, this.scene, this.camera);
        });
        this.focusLight.animus(time, renderer, this.scene, this.camera);
    },
    select: function (index) {
        index = index < 0 ? 0 : index >= this.contexts.length ? this.contexts.length - 1 : index;
        this.moveLight(index);
        if (index == this.lastIndex) return
        this.lastIndex = this.actualIndex;
        this.actualIndex = index;
        this.contexts[this.lastIndex].onClose?.();
        this.contexts[index].onOpen?.();

    },
    moveLight: function (index) {

        this.contexts[index].scenus.getWorldPosition(this.focusLight.position)

    }

};

export default ModelScene;




