'use strict';

angular.module('dnftestApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('documentation', {
        url: '/documentation',
        templateUrl: 'app/documentation/documentation.html',
        controller: 'DocumentationCtrl'
      });
  });