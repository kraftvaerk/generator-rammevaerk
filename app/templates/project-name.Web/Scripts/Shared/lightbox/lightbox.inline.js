'use strict';

import $ from 'jquery';
import 'fancyBox';

/**
 * [inlineLightbox makes a ligthbox of inline content]
 * @param  {[string]}   scope   [css selector]
 * @return {[undefined]}        [nothing returned]
 */
export default function inlineLightbox(scope){
    $(scope).each(function () {
        const elm = $(this);
        const opts = Object.assign(elm.data(), {
            padding: 20,
            type: 'inline',
            title: false,
            minHeight: 0,
            beforeLoad: function () {
                let url = this.href;
                if (!url) {
                    url = $(this).data('href');
                }
                const hash = url.substring(url.indexOf('#'));

                this.href = hash;
            }
        });

        elm.fancybox(opts);
    });
}
