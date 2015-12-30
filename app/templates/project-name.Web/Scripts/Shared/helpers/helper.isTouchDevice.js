'use strict';

/**
 * Determines whether the current device supports touch events
 * @return {Boolean} [description]
 */
export default function isTouchDevice() {
    return (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
}
