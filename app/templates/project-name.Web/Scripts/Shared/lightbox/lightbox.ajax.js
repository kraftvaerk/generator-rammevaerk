'use strict';

import $ from 'jquery';
import 'fancyBox';

/**
 * [ajaxLightbox makes an ajax lightbox]
 * @param  {[string]}   scope   [css selector]
 * @return {[undefined]}        [nothing returned]
 */
export default function ajaxLightbox(scope){
    $(scope).each(function () {
        const elm = $(this);
        const opts = Object.assign(elm.data(), {
            width: 500,
            height: 500,
            padding: 10,
            type: 'ajax',
            autoSize: false
        });

        elm.fancybox(opts);
    });
}
