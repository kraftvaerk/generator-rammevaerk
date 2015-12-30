'use strict';

import $ from 'jquery';
import 'fancyBox';

/**
 * [galleryThumbsLightbox makes a gallery with thumbnails]
 * @param  {[string]}   scope   [css selector]
 * @return {[undefined]}        [nothing returned]
 */
export default function galleryThumbsLightbox(scope){
    $(scope).fancybox({
        padding: 10,
        helpers: {
            thumbs: {
                width: 50,
                height: 50
            }
        }
    });
}
