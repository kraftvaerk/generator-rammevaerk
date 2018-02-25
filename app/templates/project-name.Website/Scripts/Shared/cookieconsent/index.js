import CookieConsent from 'kv.cookieconsent';

export function init(scope){
    if (!document.getElementById('#cookieContent')){
        return;
    }

    const cookieConsent = new CookieConsent();

    cookieConsent.init('#cookieContent');
}

export default {
    init
};
