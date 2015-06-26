'use strict';
define([
    'angular'
], function(angular) {
    angular.module('apiservice', [])
    .service('bitcoinapi', ['$http', '$log', '$q', function($http, $log, $q) {

            //Add to the end of api calls to identify ourselves
            var apiKey = "";
            var apiKeyAppend = "";

            var cachedLastHash = null;
            var getLastHashFunc = function () {
                var deferred = $q.defer();

                if (cachedLastHash === null) {
                    var promise = $http.get('api_alternate/latestblock' + apiKeyAppend);

                    promise.success(function (data, status) {
                        cachedLastHash = data.hash;
                        deferred.resolve(cachedLastHash);
                    });

                    promise.error(function () {
                        deferred.reject();
                    })
                }
                else {
                    deferred.resolve(cachedLastHash);
                }

                return deferred.promise;
            };

            var blockCache = {};

            //Returns a promise
            var newGetBlockFunc = function (hashToFind) {
                var deferred = $q.defer();

                if (blockCache[hashToFind]) {
                    deferred.resolve(blockCache[hashToFind]);
                }
                else {
                    var promiseObj = $http.get('api_alternate/rawblock/' + hashToFind + apiKeyAppend);

                    promiseObj.success(function (data, status) {
                        if (status == 200) {
                            blockCache[hashToFind] = data;
                            deferred.resolve(data);
                        }
                        else {
                            deferred.reject();
                        }
                    });

                    promiseObj.error(function () {
                        deferred.reject();
                    });
                }

                return deferred.promise;
            };

            var searchFunc = function (searchStr) {
                var deferred = $q.defer();

                newGetBlockFunc(searchStr).then(function () {
                    //Success
                    deferred.resolve();
                }, function () {
                    deferred.reject();
                });

                return deferred.promise;
            };

            var txCache = {};
            var treeFunc = function (transactionId) {
                var deferred = $q.defer();

                if (txCache[transactionId]) {
                    deferred.resolve(txCache[transactionId]);
                }
                else {
                    var promise = $http.get('api_alternate/tree/' + transactionId + '?api_code=' + apiKey + '&format=json');

                    promise.success(function (data, status) {
                        txCache[transactionId] = data;
                        deferred.resolve(data);
                    });

                    promise.error(function () {
                        deferred.reject();
                    });

                }
                return deferred.promise;
            };

            this.getLastHash = getLastHashFunc;
            this.getBlock = newGetBlockFunc;
            this.doSearch = searchFunc;
            this.getTree = treeFunc;
        }
        ]);
});

