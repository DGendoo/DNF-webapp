'use strict';

angular.module('dnftestApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('network', {
        url: '/network/:id',
        templateUrl: 'app/network/network.html',
        controller: 'NetworkCtrl'
      });
  });
