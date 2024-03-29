import BaseComponent from '/views/lib/baseComponent/baseComponent.js';
import RotatifViewer from "/views/components/rotatifViewer/rotatifViewer.js";
import Logo from '/views/components/logo/logo.js';
import SearchZone from '/views/components/searchZone/searchZone.js';
import HorizontalViewer from '/views/components/horizontalViewer/horizontalViewer.js';
import CategoryView from '/views/components/categoryView/categoryView.js';
import { categories, message } from '/views/tools/data.js';
import Catalogue from '/views/layouts/catalogue/catalogue.js';
class Home extends BaseComponent {
    constructor() {
        super({
            initCss: 'layout' // 'layout' or 'compenent' or ( 'none')
        });
    }

    mvc(_, rootName, $, $All) {
        const view = _('div', rootName,
            _('div', 'voilefont'),
            _('div', 'top-bar',
                new Logo().view,
                new SearchZone().view,
                _('ul', 'nav-links',
                    _('li', 'lien 0', _('a', '', 'abonement')),
                    _('li', 'lien 1', _('a', '', 'niveaux')),
                    _('li', 'lien 2', _('a', '', 'apropos')),
                ),
                _('div', 'user-icon')
            ),
            _('div', 'center',
                _('div', 'welcome',
                    _('div', 'center-container',
                        _('div', 'rotatif-container'),
                        _('div', 'home-message',
                            _('div', 'message', message),
                            _('div', 'button', 'recettes du jour'),
                        ),
                    ),
                    _('div', 'main-category',
                        new HorizontalViewer().view,
                    ),
                ),
                new Catalogue().view,
            ),


        );

        const controller = {
            ['.horizontal-viewer']: (elem) => {
                const getNote = (notes) => {
                    let somme = 0;
                    notes.forEach(note => {
                        somme += note;
                    });
                };
                const horizontalViews = [];

                categories.forEach((category, i) => {
                    const categoryView = new CategoryView().view;
                    categoryView.component.icon = category.url;
                    categoryView.component.name = category.name;
                    categoryView.component.note = getNote(category.note);
                    categoryView.component.message = category.message;
                    horizontalViews.push(categoryView);
                    const rotatifViews = [];
                    category.subCategories.forEach((url, j) => {

                        const rotatifView = _('div', 'view');
                        rotatifView.style.background = `no-repeat center/cover url('${url}')`;
                        rotatifViews.push(rotatifView);
                    });
                    categoryView.data = {};
                    categoryView.data.subCategories = rotatifViews;
                    categoryView.component.subcategoryNbr = rotatifViews.length;
                });
                const rotatif = new RotatifViewer({
                    duration: 2000,
                });

                ///////////// .rotatif-container ////////////////////
                $('.rotatif-container').append(rotatif.view);

                // horizontalViews.forEach((categoryView) => {
                //     categoryView.addEventListener('click', (e) => {
                //         rotatif.views = categoryView.data.subCategories;
                //     });
                // });
                rotatif.when('allInserted', () => {
                    rotatif.duration = 10000;
                });
                rotatif.when('insertRequired exitRequired', () => {
                    rotatif.duration = 3000;
                });
                /////////////////////////////////////////////////////
                elem.component.views = horizontalViews;
                elem.component.when('focus', (categoryView) => {
                    rotatif.views = categoryView.data.subCategories;
                }, null, true)

                // elem.component.when('unfocus', (view) => { 
                // }, null, true)


                this.when('A B C D', (v,e) => {
                    console.log('e : ',e);
                    console.log('v : '+v);
                });
                this.emit('A B C D', 'my Value is 4');

            },
            [rootName]: (root) => {

            }
        };
        return { view, controller };
    }
}

export default Home;