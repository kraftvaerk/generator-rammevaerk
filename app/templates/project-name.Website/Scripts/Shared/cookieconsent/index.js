import CookieConsent from 'kv.cookieconsent';

export function init(selector){
    if (!document.getElementById(selector)){
        return;
    }

    const cookieConsent = new CookieConsent();

    cookieConsent.init(selector);
}

export default {
    init
};
