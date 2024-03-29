import EventEmiter from '../../lib/event/eventEmiter.js'
import Server from '../../lib/server/server.js';
import Anim from '../../lib/anim/Anim.js';
const BASE_LINK = '../views';




class BaseComponent extends EventEmiter {

    static initialysedList = [];
    /**
     * 
     * @param {Object} model 
     * @param {Object} data 
     */

    constructor(model, data) {
        super();

        this.Server = Server;
        this.Anim = Anim;
        this.EventEmiter = EventEmiter;

        BaseComponent.initCss(this, model.initCss);
        delete model.initCss;

        for (const key in model) {
            if (Object.hasOwnProperty.call(model, key)) {//

                Object.defineProperties(this, {
                    [key]: {
                        get: function () {
                            return model[key]
                        },
                        set: function (value) {
                            model[key] = value;
                            this.emit(key, value);
                        },
                    }
                });
            }
        }
        if (data) {
            for (const key in model) {
                if (Object.hasOwnProperty.call(data, key)) {
                    if (data[key] != undefined) {
                        this[key] = data[key];
                    }
                }
            }
        }

        const { view, controller } = this.mvc(this.#create, this.getName(), this.#selector, this.#selectorAll);

        if (!(view instanceof HTMLElement)) throw new Error("<<tree>> must be HTMLElement");
        view.component = this;
        this.view = view;
        
        ///////////// call all actions  when Component charged/////////////////////////

        function isMounted(node) {
            if (node === document.body) return true;
            if (node.parentNode == undefined) return false;
            return isMounted(node.parentNode);
        }

       
        new Promise((resolve, reject) => {
            const id = setInterval(() => {
                if (isMounted(view)) {
                    resolve(view);
                    clearInterval(id);
                }
            });
        }).then(() => {
            this.#callControllers(model, controller);
        });
    }

    #callControllers(model, controller) {
        for (const selector in controller) {
            if (Object.hasOwnProperty.call(controller, selector)) {
                if (!(controller[selector] instanceof Function)) throw new Error(`<<controller['${selector}']>> must be Function`);
            }
        }
        for (const selector in controller) {
            if (Object.hasOwnProperty.call(controller, selector)) {
                controller[selector](this.#selector(selector), this.#selectorAll(selector));
            }
        }

        //////////////  emite all model property ///////////////////
        for (const key in model) {
            if (Object.hasOwnProperty.call(model, key)) {
                this.emit(key, model[key]);
            }
        }
    }

    /**
     * 
     * @param {String} selector 
     * @returns 
     */
    #selector = (selector) => {
        let elem = selector == this.getName() ? this.view : this.view.querySelector(selector);
        return elem;
    }
    /**
     * 
     * @param {Array} selector 
     * @returns 
     */
    #selectorAll = (selector) => {
        let elem = selector == this.getName() ? this.view : this.view.querySelectorAll(selector);
        return elem;
    }

    /**
     * 
     * @param {BaseComponent} component 
     * @param {String} link 
     */
    static initCss(component, type) {
        type = type === undefined ? 'component' : type;
        if (type == 'none') {
            return;
        } else if (type != 'component' && type != 'layout') {
            throw new Error(`initCss(BaseComponent , ['component' or undefined] || 'layout'||'none' ) : ${type} is not a valid type`);
        }
        type += 's';
        let name = component.constructor.name;
        name = name.substring(0, 1).toLocaleLowerCase() + name.substring(1);
        const link = BASE_LINK + '/' + type + '/' + name + '/' + name + ".css";

        if (!BaseComponent.initialysedList.includes(name)) {
            const linkElem = document.createElement('link');
            linkElem.rel = "stylesheet";
            linkElem.href = link;
            document.head.prepend(linkElem);
            BaseComponent.initialysedList.push(name);
        }
    }
    /**
     * 
     * @param {String} type 
     * @param {String} className 
     * @param  {...ChildNode} childrens 
     * @returns 
     */
    #create = (type, className, ...childrens) => {
        const elem = document.createElement(type);
        
        elem.className = className;
        
        elem.append(...childrens);
        return elem;
    }

    /**
     * 
     * @returns 
     */
    getName() {
        let name = this.constructor.name;
        name = name.split('');
        name = name.map((l, i) => {
            const lower = l.toLocaleLowerCase();
            return (lower > l) && i != 0 ? '-' + lower : lower;
        });
        name = name.join('');
        return name;
    }
    /**
     * 
     * @param {Function} createElement  
     * @param {Function} selector 
     * @param {String} rootName 
     * @returns 
     */
    mvc(_, rootName, $) {
        const view = _('div', rootName,
            'Create your component',
            _('div', 'btn1', 'Test Translation'),
            _('div', 'btn2', 'Test Rotate')
        );

        const controller = {
            ['.btn1']: (elem) => {
                this.#basicAnim(elem, $(rootName), 'translateY', 'px');
            },

            ['.btn2']: (elem) => {
                this.#basicAnim(elem, $(rootName), 'rotateZ', 'deg');
            }
        }

        return { view, controller };
    }

    #basicAnim(elem, root, type, unit) {
        const litleAnim = new this.Anim().when('progress', (p) => {
            const v = Math.sin(p * Math.PI * 2) * 300 * (1 / (1 + p * 10));
            root.style.transform = type + '(' + v + unit + ')';
        }).when('change', (p) => {
            root.style.background = p.status != 'onEnd' ? '#555' : '#0000';
        }).when('onEnd', (p) => {
            //elem.textContent = 'success';
        })
        elem.addEventListener('click', () => {
            litleAnim.start();
        });
    }

}

export default BaseComponent;
