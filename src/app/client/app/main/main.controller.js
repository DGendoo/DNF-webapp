'use strict';

angular.module('dnftestApp')
  .controller('MainCtrl', function ($scope, $state) {
    $('.ui.dropdown')
      .dropdown({
        onChange: function (result, response) {
          $state.go('network', {id: response});
        }
      });
  });
