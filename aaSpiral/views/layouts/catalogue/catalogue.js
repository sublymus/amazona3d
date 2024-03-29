import BaseComponent from '/views/lib/baseComponent/baseComponent.js'
/**
 *   code minimal pour  crer un composant
 */
class Catalogue extends BaseComponent{
    constructor(data){
        super({
          initCss : 'layout'
        }, data);
    }
    elementTree(_, rootName, $, $All) {
        const tree = _('div', rootName,
           
        );
        
        const action = {
            
            ['SELECTOR']: (elem, elems) => {
               
            },
            [rootName]: (elem, elems) => {
                
            }
        };
        return { tree, action };
    }
}

export default Catalogue ;