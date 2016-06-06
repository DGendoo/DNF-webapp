'use strict';

angular.module('dnftestApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('network', {
        url: '/network/:ids',
        templateUrl: 'app/network/network.html',
        controller: 'NetworkCtrl'
      });
  });
