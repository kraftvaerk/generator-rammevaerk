'use strict';

import $ from 'jquery';
import 'fancyBox';

/**
 * [videoLightbox description]
 * @param  {[type]} scope [description]
 * @return {[type]}       [description]
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
