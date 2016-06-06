'use strict';

angular.module('dnftestApp')
  .controller('NetworkCtrl', function ($scope, $http, Restangular) {
    $scope.selected = null;
    $scope.showOptions = false;
    $scope.dest = null;
    $scope.nodeToSearch = null;
    $scope.image = null;
    $scope.networkToShow = 'CTRP';
    $scope.networkData = null;
    $scope.nodes = {title : 'hiiiiiiii'};
    $scope.cy = null;

    $scope.cy.on('tap', 'node', function (evt) {
      $scope.selected = evt.cyTarget.id();
      $scope.cy.zoom(2);
      $scope.cy.center('#' + evt.cyTarget.id());
    });

    $scope.bringBack = function () {
      $scope.cy.reset();
    };

    $scope.search = function (node) {
      $scope.cy.zoom(2);
      $scope.cy.center('#' + node);
    };

    $scope.download = function () {
      var downloadLink = angular.element('<a></a>');
      downloadLink.attr('href', $scope.cy.png());
      downloadLink.attr('download', 'network.png');
      downloadLink[0].click();
    };

    $scope.showNetwork = function () {
    };

    $scope.populateDrugList = function () {

      if ($stateParams.id == 'CTRP') {
        $.getJSON( 'assets/data/ctrp.json', function(json){
          $scope.nodes = json.data;
        });
      } else if ($stateParams.id == 'NCI60') {
        $.getJSON( 'assets/data/nci60.json', function(json){
          $scope.nodes = json.data;
        });
      };
    };

    $('.ui.search')
      .search({
        source: $scope.nodes,
        searchFields: [
          'title'
        ],
        searchFullText: false,
        onSelect: function (result, response) {
          $scope.search(result.title);
        }
      });

    /// run this code when controller load
    $scope.showNetwork();
    $scope.populateDrugList();
  });
