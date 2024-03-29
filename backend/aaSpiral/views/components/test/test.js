import BaseComponent from '/views/lib/baseComponent/baseComponent.js'
/**
 *   code minimal pour  crer un composant
 */
class Test extends BaseComponent{
    constructor(data){
        super({
          
        }, data);
    }
    mvc(_, rootName, $, $All) {
        const view = _('div', rootName,
            //'childrens'
        );
        
        const controller = {
            
            ['SELECTOR']: (elem, elems) => {
               
            },
            [rootName]: (elem, elems) => {
                
            }
        };
        return { view, controller };
    }
}

export default Test ;