import $ from 'jquery';
import '@fancyapps/fancybox';

/**
 * Init default Lightbox
 *
 * @param {string} scope CSS selector
 */
export default function defaultLightbox(scope){
    $(scope).each(function () {
        const elm = $(this);
        const opts = Object.assign(elm.data(), {
            padding: 10
        });

        elm.fancybox(opts);
    });
}
