'use strict';

/**
 * Adds or updates querystring
 * @param  {string} uri   string (could be document.location.search)
 * @param  {string} key   querystring name
 * @param  {string} value new value for querystring
 * @return {string}       updated querystring
 */
export default function updateQueryStringParameter(uri, key, value) {
    const regEx = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
    const separator = uri.indexOf('?') !== -1 ? '&' : '?';

    if (uri.match(regEx)) {
        return uri.replace(regEx, '$1' + key + '=' + value + '$2');
    }

    return uri + separator + key + '=' + value;
}
