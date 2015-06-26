'use strict';
define([
    'angular'
], function(angular) {
    angular.module('bitcoinFilters', []).filter('trimLeadingZeroes', function () {
        return function (input) {
            return input.replace(/^0+/, '');
        };
    });
});