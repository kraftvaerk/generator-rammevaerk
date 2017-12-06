import $ from 'jquery';
import '@fancyapps/fancybox';

/**
 * Init video Lightbox
 *
 * @param {string} scope CSS selector
 */
export default function videoLightbox(scope){
    $(scope).each(function () {
        const elm = $(this);
        const opts = Object.assign(elm.data(), {
            padding: 0,
            openEffect: 'none',
            closeEffect: 'none',
            height: 455,
            helpers: {
                media: {}
            }
        });

        elm.fancybox(opts);
    });
}
