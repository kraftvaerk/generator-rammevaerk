import $ from 'jquery';

/**
 * Scroll page to a specific element
 *
 * @param {string} selector    CSS selector
 * @param {number} speed       Speed in ms
 * @param {number} scrollNudge
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
