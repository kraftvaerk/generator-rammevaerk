import $ from 'jquery';
import cookieConsent from '@/Shared/cookieconsent/index';

// Expose jQuery to global scope
global.$ = global.jQuery = $;

// Add an alias to the app, if app if needed to be called from outside
window.app = window.app || {};

window.app.common = {
    dynamicImportModules() {
        const lightBoxElm = document.querySelector('[class*=js-lightbox]');
        if (lightBoxElm) {
            import(/* webpackChunkName: "lightbox" */ '@/Shared/lightbox').then(({default: lightBox}) => {
                lightBox.normal('.js-lightbox');
                lightBox.iframe('.js-lightbox-iframe');
                lightBox.video('.js-lightbox-video');
            });
        }
    },
    // app.common.init runs on all pages
    init() {
        console.log('%cINIT', 'padding:0 4px;background:#090;color:#fff', '<%= answers.projectName %>'); // eslint-disable-line no-console

        cookieConsent.init();

        this.dynamicImportModules();
    }
};


/**
 * Initial Application bootstrapping
 */

// jQuery document ready
$(() => window.app.common.init($));
