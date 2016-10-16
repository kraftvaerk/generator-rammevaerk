'use strict';

import normal       from './lightbox.default';
import elastic      from './lightbox.elastic';
import gallery      from './lightbox.gallery';
import iframe       from './lightbox.iframe';
import inline       from './lightbox.inline';
import nooverlay    from './lightbox.nooverlay';
import video        from './lightbox.video';

/**
 * [init initilizes all lightboxes]
 * @param  {[object]} scopes    [a object keys as function names and value as selectors]
 * @return {[undefined]}        [nothing returned]
 */
export default {
    normal,
    elastic,
    gallery,
    iframe,
    inline,
    nooverlay,
    video
};
