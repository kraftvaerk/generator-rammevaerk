'use strict';

import $ from 'jquery';
import 'fancyBox';

/**
 * [noOverlayLightbox without overlay]
 * @param  {[string]}   scope   [css selector]
 * @return {[undefined]}        [nothing returned]
 */
export default function noOverlayLightbox(scope){
    $(scope).each(function () {
        const elm = $(this);
        const opts = Object.assign(elm.data(), {
            padding: 10,
            helpers: {
                overlay: null,
                title: {
                    type: 'over'
                }
            }
        });

        elm.fancybox(opts);
    });
}
