'use strict';

import $ from 'jquery';
import 'fancyBox';

/**
 * [galleryLightbox makes a group gallery]
 * @param  {[string]}   scope   [css selector]
 * @return {[undefined]}        [nothing returned]
 */
export default function galleryLightbox(scope){
    $(scope).fancybox({
        padding: 10,
        groupAttr: 'data-gallery-group',
        helpers: {
            title: {
                type: 'over'
            }
        },
        beforeLoad: function () {
            this.title = (this.index + 1) + ' / ' + this.group.length + (this.title ? ' - ' + this.title : '');
        }
    });
}
