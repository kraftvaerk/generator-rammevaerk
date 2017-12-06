import $ from 'jquery';
import '@fancyapps/fancybox';

const defaults = {
    width: '75%',
    height: '75%',
    padding: 10,
    type: 'iframe',
    iframe: {
        scrolling: 'auto',
        preload: true
    },
    autoSize: false
};

function lightboxClassInit(scope) {
    $(scope).each(function () {
        const elm = $(this);
        const opts = Object.assign(elm.data(), defaults);

        elm.fancybox(opts);
    });
}

function lightboxInit(newOpts) {
    const opts = Object.assign(newOpts, defaults);

    window.$.fancybox(opts);
}

export default function iframeLightbox(input){
    if (typeof input === 'string') {
        lightboxClassInit(input);
    } else if (typeof input === 'object') {
        lightboxInit(input);
    }
}
