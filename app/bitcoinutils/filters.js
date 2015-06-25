'use strict';

angular.module('bitcoinFilters', []).filter('trimLeadingZeroes', function() {
    return function(input) {
        return input.replace(/^0+/, '');
    };
});