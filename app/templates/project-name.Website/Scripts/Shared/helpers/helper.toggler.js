'use strict';

import $ from 'jquery';
/**
 * Simply toggles parameter show/hide
 * @return {[undefined]}       [nothing returned]
 */

export default function toggler(){
    /* accordion data-parameters
     * @param  {[number]} speed    [speed in ms]
     * @param  {[string]} object    [selector of toggled element]
     * @param  {[animation]} object    [toggling animation]
     */
    const TOGGLER = '.js-toggler';
    const ANIMATIONS = {
        'fade': $.fn.fadeToggle,
        'slide': $.fn.slideToggle
    };
    const $toggler = $(TOGGLER);
    const speed = $toggler.data('togglerSpeed') || 500;
    const obj = $toggler.data('togglerObj');
    const animation = $toggler.data('togglerAnimation');
    const $obj = $(obj);
    const animationFunc = ANIMATIONS[animation] || $.fn.toggle;

    $toggler.click(function(e){
        e.preventDefault();
        animationFunc.call($obj, speed);
    });

}
