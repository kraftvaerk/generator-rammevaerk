'use strict';

/**
 * [autotab on keyup jumps to next input]
 * @param  {[string]} original      [css selector]
 * @param  {[string]} destination   [css selector]
 * @return {[undefined]}            [nothing returned]
 */
export default function autotab(original, destination){
    if (!original){
        return;
    }

    if (original.val().length === parseInt(original.attr('maxlength'), 10)){
        destination.focus();
        destination.bind('keyup', function(){
            if (destination.val().length === 0){
                destination.unbind('keyup');
                original.focus();
            }
        });
    }
}
