'use strict';

import $ from 'jquery';
import 'fancyBox';

/**
 * [defaultLightbox]
 * @param  {[string]}   scope   [css selector]
 * @return {[undefined]}        [nothing returned]
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
