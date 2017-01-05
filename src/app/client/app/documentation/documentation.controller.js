'use strict';

angular.module('dnftestApp')
  .controller('DocumentationCtrl', function ($scope, $window) {
    $scope.message = 'Hello';

    $scope.back = function () {
      $window.history.back();
    }
  });
