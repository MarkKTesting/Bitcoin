'use strict';

angular.module('myApp.viewMaster', ['ngRoute', 'apiservice'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/viewMaster', {
            templateUrl: 'viewMaster/master.html',
            controller: 'ViewMasterCtrl'
        });
    }])

    .controller('ViewMasterCtrl', [ '$scope', '$http', 'bitcoinapi', function($scope, $http, bitcoinapi){
        var master = this;
        master.latestHash = "";
        master.rawObjects = [];

        // Get the hash for the latest block
        bitcoinapi.getLastHash().then(function(data){
            //Log the latest hash and its index
            master.latestHash = data;

            master.loadPrevious = function () {
                var currentHead = master.rawObjects[master.rawObjects.length-1];

                master.rawObjects = [];
                getBlockFromHash(currentHead.hash);
            };

            var getBlockFromHash = function(hash_to_get)
            {
                bitcoinapi.getBlock(hash_to_get).then(function(block_data){
                    master.rawObjects.push(block_data);

                    //Change the number here to determine how many blocks are displayed
                    if ( master.rawObjects.length < 3 )
                    {
                        getBlockFromHash(block_data.prev_block);
                    }
                });
            };

            master.rawObjects = [];
            getBlockFromHash(master.latestHash);
        });
    }
    ]
);