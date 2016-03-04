'use strict';

import $ from 'jquery';

/**
 * [scrollToElm description]
 * @param  {[string]} selector [css selector]
 * @param  {[number]} speed    [speed in ms]
 * @return {[undefined]}       [nothing returned]
 */
export default function scrollToElm(selector, speed = 500, scrollNudge = 74) {
    if (!selector){
        return;
    }

    const scrollToPos = selector ? $(selector).offset().top - scrollNudge : 0;

    $('html, body').animate({
        scrollTop: scrollToPos
    }, speed);
}
