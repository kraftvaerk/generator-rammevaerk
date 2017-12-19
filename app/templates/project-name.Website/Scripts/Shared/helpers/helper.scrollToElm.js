import $ from 'jquery';

/**
 * Scroll page to a specific element
 *
 * @param {string} selector         CSS selector
 * @param {number} [speed=500]      Speed in ms
 * @param {number} [scrollNudge=74]
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
