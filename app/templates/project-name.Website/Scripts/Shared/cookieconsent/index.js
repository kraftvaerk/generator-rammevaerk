'use strict';

import $ from 'jquery';
import 'kv.cookieconsent';

export function init(scope, settings){
    if (!scope){
        return;
    }

    const option = Object.assign({
        cookieName: 'cookieConsent',
        btn: {
            accept: '.accept'
        },
        transition: {
            show: {
                type: 'fadeIn',
                duration: 500
            },
            hide: {
                type: 'fadeOut',
                duration: 500
            }
        },
        consentType: 'explicit'
    }, settings);

    $(scope).cookieConsent(option);
}

export default {
    init
};
