'use strict';

angular.module('dnftestApp')
  .controller('MainCtrl', function ($scope, $http, Restangular) {
    $scope.selected = null;
    $scope.showOptions = false;
    $scope.dest = null;
    $scope.nodeToSearch = null;
    $scope.image = null;
    $scope.networkToShow = 'CTRPV2';
    $scope.nodes = [{title: 'COL3'}, {title: 'Myriocin'}, {title: 'Oligomycina'}];


    $scope.cy = cytoscape({


      container: document.getElementById('cy'),
      elements: {nodes: [
        { data: { id: 'n0' } },
        { data: { id: 'n1' } },
        { data: { id: 'n2' } },
        { data: { id: 'n3' } },
        { data: { id: 'n4' } },
        { data: { id: 'n5' } },
        { data: { id: 'n6' } },
        { data: { id: 'n7' } },
        { data: { id: 'n8' } },
        { data: { id: 'n9' } },
        { data: { id: 'n10' } },
        { data: { id: 'n11' } },
        { data: { id: 'n12' } },
        { data: { id: 'n13' } },
        { data: { id: 'n14' } },
        { data: { id: 'n15' } },
        { data: { id: 'n16' } }
      ],
        edges: [
          { data: { source: 'n0', target: 'n1'} },
          { data: { source: 'n1', target: 'n2'} },
          { data: { source: 'n1', target: 'n3' } },
          { data: { source: 'n4', target: 'n5' } },
          { data: { source: 'n4', target: 'n6' } },
          { data: { source: 'n6', target: 'n7' } },
          { data: { source: 'n6', target: 'n8' } },
          { data: { source: 'n8', target: 'n9' } },
          { data: { source: 'n8', target: 'n10' } },
          { data: { source: 'n11', target: 'n12' } },
          { data: { source: 'n12', target: 'n13' } },
          { data: { source: 'n13', target: 'n14' } },
          { data: { source: 'n13', target: 'n15' } },
        ]}

      ,

      layout: {
        name: 'cose',
        // idealEdgeLength: function( edge ){
        //   console.log(edge._private.data.source == 'n0');
        //   if (edge._private.data.source == 'n0' && edge._private.data.target == 'n1') {
        //     return 1;
        //   } else {
        //     return 1000;
        //   };
        // }
      },

      zoom: 0.5
      ,

      // so we can see the ids etc
      style: [
        {
          selector: 'node',
          style: {
            'content': 'data(id)',
            'background-fit': 'cover'
          }
        },

        {
          selector: ':parent',
          style: {
            'background-opacity': 0.2
          }
        },
        {
          selector: '#COL3',
          style: {
            'background-image': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Lovastatin.svg/2000px-Lovastatin.svg.png'
          }
        },
        {
          selector: '#Oligomycina',
          style: {
            'background-image': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Lovastatin.svg/2000px-Lovastatin.svg.png'
          }
        },
        {
          selector: '#Myriocin',
          style: {
            'background-image': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Lovastatin.svg/2000px-Lovastatin.svg.png'
          }
        },
        {
          selector: '#e1',
          style: {
            'label': 10
          }
        }
      ]

    });





    $scope.cy.on('tap', 'node', function (evt) {
      $scope.selected = evt.cyTarget.id();
      $scope.cy.zoom(2);
      $scope.cy.center('#' + evt.cyTarget.id());

      //$scope.$apply();
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

      if ($scope.networkToShow == 'CTRP') {
        $.getJSON( 'assets/ctrp.json', function(json){
          $scope.nodes = json.data;
        });
      }
      else if ($scope.networkToShow == 'NCI60') {
        $.getJSON( 'assets/nci60.json', function(json){
          $scope.nodes = json.data;
        });
      }
      //default 'CTRPV2' network
      else {
        $scope.nodes = [{title: 'COL3'}, {title: 'Myriocin'}, {title: 'Oligomycina'}]
      }
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

    $('.ui.dropdown')
      .dropdown({
        onChange: function (result, response) {
          $scope.networkToShow = response;
          $scope.showNetwork();
          $scope.populateDrugList();
        }
      });

    /// run this code when controller load
    $scope.showNetwork();
    $scope.populateDrugList();


    //
    // Restangular.all('api/things').get('').then(function (serverJson) {
    //   console.log('yya')
    // });

  });
