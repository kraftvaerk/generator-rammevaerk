'use strict';

import $ from 'jquery';

export default function dataFx(){
    $('[data-fx-fade-out]').each(function(){
        $(this).fadeOut($(this).data('fadeOut'));
    });

    $('[data-fx-fade-in]').each(function(){
        $(this).fadeIn($(this).data('fadeIn'));
    });
}
