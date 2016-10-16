'use strict';

import '../Shared/legacy/features';
import '../Shared/legacy/polyfills';

import $                from 'jquery';
import svg4everybody    from 'svg4everybody';

import helpers          from '../Shared/helpers/index';
<% if (use.cookieConsent){ %>import cookieConsent    from '../Shared/cookieconsent/index';<% } %>
<% if (use.lightbox){ %>import lightbox         from '../Shared/lightbox/index';<% } %>

//Add an alias to the App, if we need to call App from the outside:
window.App = window.App || {};

<% if (use.lightbox){ %>window.App.lightbox = lightbox;<% } %>
window.App.helpers = helpers;


window.App.common = {
    // App.common.init runs on all pages
    init() {
        console.log('jquery:', $.fn.jquery);

<% if (use.svgSprites){ %>        svg4everybody();
<% if (use.cookieConsent){ %>        cookieConsent.init('#cookieConsent');<% } %>

<% if (use.lightbox){ %>        this.lightbox();<% } %>
    },
    <% if (use.lightbox){ %>
    lightbox() {
        lightbox.normal('.lightbox');
        lightbox.elastic('.lightbox-elastic');
        lightbox.flash('.lightbox-flash');
        lightbox.gallery('.lightbox-gallery');
        lightbox.iframe('.lightbox-iframe');
        lightbox.nooverlay('.lightbox-nooverlay');
        lightbox.video('.lightbox-video');
    }<% } %>
};


/**
 * Initial Application bootstrapping
 */

// jQuery document ready
$(document).ready(() => {
    window.App.common.init($);
});
