import CookieConsent from '@kraftvaerk/cookieconsent';

export function init(selector) {

    const cookieConsent = new CookieConsent({
        cookieName: 'cookieConsent',
        btn: {
            accept: 'js-cookie-accept',
            close: 'js-cookie-close'
        },
        toggleClass: 'is-shown'
    });

    try {
        cookieConsent.init(selector ? selector : '#cookieContent');
    } catch (err) {
        //
    }
}

export default {
    init
};
