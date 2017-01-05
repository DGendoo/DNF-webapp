'use strict';

angular.module('dnftestApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('network', {
        url: '/network/:id',
        templateUrl: 'app/network/network.html',
        controller: 'NetworkCtrl'
      });
    $stateProvider
      .state('exemplar',{
        url:'/exemplar/:id',
        templateUrl: 'app/network/network.html',
        controller: 'ExemplarCtrl'
      });
    $stateProvider
      .state('cluster',{
      	url:'/cluster/:id/:clusterId',
      	templateUrl: 'app/network/network.html',
      	controller: 'ClusterCtrl'
      })
  });
