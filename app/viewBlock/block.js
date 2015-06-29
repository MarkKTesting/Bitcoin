'use strict';
define([
    'angular',
    'angularRoute',
    'bitcoinutils/apiservice'
], function(angular) {

    angular.module('myApp.viewBlock', ['ngRoute', 'apiservice'])
        .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/viewBlock', {
            templateUrl: 'viewBlock/block.html',
            controller: 'ViewBlockCtrl'
            });
        }])
        .controller('ViewBlockCtrl', [ '$http', '$routeParams', 'bitcoinapi', function($http, $routeParams, bitcoinapi){
            //Receive the block hash in the route parameters
            this.blockHash = $routeParams.blockId;
            this.totalBTC = 0;
            this.verifyResult = "";

            var container = this;
            var blockData = {};

            //Function to calculate the total out value BTC for a transaction
            this.getTotalOut = function(transactionRow){
                var totRet = 0.0;

                //Sum up the value of each out item
                for ( var i = 0; i < transactionRow.out.length; ++i )
                {
                    totRet += transactionRow.out[i].value;
                }

                return totRet;
            };

            this.doVerify = function(){
                bitcoinapi.doVerify(container.blockData).then(function(data){
                    container.verifyResult = data;
                });
            };

            bitcoinapi.getBlock($routeParams.blockId).then(function(block_data_result){
                container.blockData = block_data_result;
                container.transactions = block_data_result.tx;

                //Sum up the total BTC from each transaction element to get the total BTC value for this block
                container.totalBTC = 0;
                for ( var t = 0; t < container.transactions.length; ++t )
                {
                    container.totalBTC += container.getTotalOut(container.transactions[t]);
                }
            });
        }
        ]);
});
