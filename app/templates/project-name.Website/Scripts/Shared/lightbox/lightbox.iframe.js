'use strict';

import $ from 'jquery';
import 'fancyBox';

/**
 * [iframeLightbox makes a lightbox with iframe]
 * @param  {[string]}   scope   [css selector]
 * @return {[undefined]}        [nothing returned]
 */
export default function iframeLightbox(scope){
    $(scope).each(function () {
        const elm = $(this);
        const opts = Object.assign(elm.data(), {
            width: '75%',
            height: '75%',
            padding: 10,
            type: 'iframe',
            iframe: {
                scrolling: 'auto',
                preload: true
            },
            autoSize: false
        });

        elm.fancybox(opts);
    });
}
