'use strict';

export default function getTopLevelCountryCode () {
    const hostnameSplit = window.location.hostname.split('.');
    const countryCode = hostnameSplit[hostnameSplit.length - 1];

    /** If country code is more than 3 chars we assume we are on localhost. In that case we use 'se' */
    if (countryCode.length > 3) {
        return 'se';
    }

    return countryCode;
}
