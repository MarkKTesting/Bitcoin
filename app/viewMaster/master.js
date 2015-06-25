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

        //Function to calculate the total out value BTC for a transaction
        this.getTotalOut = function(block){
            var totRet = 0.0;

            for ( var t = 0; t < block.tx.length; ++t ) {
                //Sum up the value of each out item
                for (var i = 0; i < block.tx[t].out.length; ++i) {
                    totRet += block.tx[t].out[i].value;
                }
            }

            return totRet;
        };

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
                    if ( master.rawObjects.length < 9 )
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