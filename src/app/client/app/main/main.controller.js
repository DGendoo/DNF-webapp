'use strict';

angular.module('dnftestApp')
  .controller('MainCtrl', function ($scope, $state, $location, $anchorScroll) {
    $('.ui.dropdown')
      .dropdown({
        onChange: function (result, response) {
          $state.go('network', {id: response});
        }
      });

    $scope.showHelp = false;

    $scope.help = function () {
      $scope.showHelp = true;
    };

    $scope.scrollTo = function(section) {
      // $location.hash(section);
      $anchorScroll(section);

        // $('html, body').stop().animate({
        //   scrollTop: ($(section).offset().top - 50)
        // }, 1250, 'easeInOutExpo');
        // event.preventDefault();

    };

    //Remove tool bar
    $("div.ui-cytoscape-toolbar").remove();

  });
