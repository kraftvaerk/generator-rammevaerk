'use strict';

import $ from 'jquery';
import 'fancyBox';

/**
 * [elasticLightbox with elastic open and close effect]
 * @param  {[string]}   scope   [css selector]
 * @return {[undefined]}        [nothing returned]
 */
export default function elasticLightbox(scope){
    $(scope).each(function () {
        const elm = $(this);
        const opts = Object.assign(elm.data(), {
            padding: 10,
            openEffect: 'elastic',
            openSpeed: 150,
            closeEffect: 'elastic',
            closeSpeed: 150,
            closeClick: true,
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
