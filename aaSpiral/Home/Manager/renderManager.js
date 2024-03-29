import  SpiralScene from "/aaSpiral/Material/spiralScene.js";
import  ModelScene from "/aaSpiral/OBJ_GLTF/modelScene.js";
import Menu from '/aaSpiral/views/components/menu/menu.js'
const RenderManager = {
    
    init(renderer){
        
        SpiralScene.init(renderer);
        ModelScene.init(renderer);
        this.select(SpiralScene)
        this.menu = new Menu({
            items: [
                {
                    label : 'Material Texture Ligth Shadow',
                    listener : ()=> {
                        this.select(SpiralScene);
                    }
                },
                {
                    label : 'Model',
                    listener : ()=> {
                        this.select(ModelScene);
                    }
                },
                {
                    label : 'Animation Skin Skeketon',
                    listener : ()=> {
                        this.select(ModelScene);
                    }
                },
                {
                    label : 'Physics',
                    listener : ()=> {
                        this.select(ModelScene);
                    }
                },
                {
                    label : 'Geometry',
                    listener : ()=> {
                        this.select(ModelScene);
                    }
                },
                {
                    label : 'Shaders',
                    listener : ()=> {
                        this.select(ModelScene);
                    }
                },
                {
                    label : '..raycaster instancing select',
                    listener : ()=> {
                        this.select(ModelScene);
                    }
                },
                {
                    label : 'particule sprite',
                    listener : ()=> {
                        this.select(ModelScene);
                    }
                },
                {
                    label : 'Audio',
                    listener : ()=> {
                        this.select(ModelScene);
                    }
                },
                {
                    label : 'Model',
                    listener : ()=> {
                        this.select(ModelScene);
                    }
                },
                {
                    label : 'Model',
                    listener : ()=> {
                        this.select(ModelScene);
                    }
                },
                {
                    label : 'Model',
                    listener : ()=> {
                        this.select(ModelScene);
                    }
                },
            ]
        });
        document.body.appendChild(this.menu.view);
      
    
    },
    animation(time , renderer){
       
        this.manager.animus(time , renderer);
    },
    select(manager){
        if(manager == this.manager) return;
        this.manager?.onClose?.();
        this.manager = manager;
        manager?.onOpen?.();
        this.scene = manager.scene;
        this.camera = manager.camera;
    },
    
};

export default RenderManager;




