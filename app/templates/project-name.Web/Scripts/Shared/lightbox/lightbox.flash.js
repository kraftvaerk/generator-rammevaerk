'use strict';

import $ from 'jquery';
import 'fancyBox';

/**
 * [flashLightbox makes a lightbox with swf/flash file]
 * @param  {[string]}   scope   [css selector]
 * @return {[undefined]}        [nothing returned]
 */
export default function flashLightbox(scope){
    $(scope).each(function () {
        const elm = $(this);
        const opts = Object.assign(elm.data(), {
            padding: 10,
            type: 'swf',
            swf: {
                wmode: 'transparent',
                allowfullscreen: 'true',
                allowscriptaccess: 'always'
            },
            autoSize: false
        });

        elm.fancybox(opts);
    });
}
