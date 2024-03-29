import BaseComponent from '../../lib/baseComponent/baseComponent.js'
/**
 *   code minimal pour  crer un composant
 */
class Menu extends BaseComponent {
    constructor(data) {
        super({
            items: [],
        }, data);
    }
    mvc(_, rootName, $, $All) {
        const emitter  = new this.EventEmiter();
        const view = _('div', rootName,
        );

        const controller = {

            [rootName]: (root) => {
                this.when('items', (items) => {
                    items.forEach(item => {
                        const itemElement = _('div', 'item', item.label);
                        item.itemElement = itemElement;
                        itemElement.addEventListener('click', () => {
                            emitter.emit('click', item);
                        });
                        root.appendChild(itemElement);
                    });

                if(items.length > 0) emitter.emit('click', items[0]);
                });
                emitter.when('click', (item) => {
                    item.listener?.();
                    root.childNodes.forEach(itemElement => {
                        itemElement.classList.remove('active');
                    });
                    item.itemElement.classList.add('active');
                    this.emit('change', item);
                }, true );
            }
        };
        return { view, controller };
    }
}

export default Menu;