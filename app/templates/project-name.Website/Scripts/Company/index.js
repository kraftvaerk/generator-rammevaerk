'use strict';

import $                from 'jquery';

import cookieConsent    from '../Shared/cookieconsent/index';
import lightbox         from '../Shared/lightbox/index';

// Expose jQuery to global scope
global.$ = global.jQuery = $;

//Add an alias to the App, if we need to call App from the outside:
window.App = window.App || {};

window.App.common = {
    // App.common.init runs on all pages
    init() {
        console.log('jQuery:', $.fn.jquery);

        cookieConsent.init('#cookieConsent');

        this.lightbox();
    },
    lightbox() {
        lightbox.normal('.lightbox');
        lightbox.iframe('.lightbox-iframe');
        lightbox.video('.lightbox-video');
    }
};


/**
 * Initial Application bootstrapping
 */

// jQuery document ready
$(document).ready(() => {
    window.App.common.init($);
});
