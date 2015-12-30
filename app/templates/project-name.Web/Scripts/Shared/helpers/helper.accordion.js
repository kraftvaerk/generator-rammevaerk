'use strict';

import $ from 'jquery';
/**
 * Small plugin for accordion
 * @return {[undefined]}       [nothing returned]
 */

export default function accordion(){
    //classes
    const ACCORDION = 'js-accordion';
    const TOGGLER = ACCORDION + '__toggler';
    const SLIDER = ACCORDION + '__slider';
    const $accordions = $('.' + ACCORDION);

    //saving accordion scope
    $accordions.each(function(index, el){
        const $accordion = $(el);
        const $toggler = $accordion.find('.' + TOGGLER);

        /* accordion data-parameters
         * @param  {[number]} speed    [speed in ms]
         */
        const speed = $accordion.data('accordionSpeed') || 500;

        $toggler.each(function(indexInner, elInner) {
            const $el = $(elInner);
            const $relatedSlider = $el.parent().find('.' + SLIDER);

            //if you want to initially open some of the sliders
            if(!$el.hasClass(TOGGLER + '--active')) {
                $relatedSlider.hide();
            }

            $el.on('click', function(e) {
                e.preventDefault();
                $el.toggleClass(TOGGLER + '--active');
                //no css3 animation because of css rules shadowing risk
                $relatedSlider.stop().slideToggle(speed);
            });
        });
    });
}
