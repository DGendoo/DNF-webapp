'use strict';

angular.module('dnftestApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.selected = null;
    $scope.showOptions = false;
    $scope.dest = null;
    $scope.nodeToSearch = null;
    $scope.image = null;
    $scope.networkToShow = 'CTRPV2';

    $scope.nodes = [{title: 'COL3'}, {title: 'Myriocin'}, {title: 'Oligomycina'}];


    $scope.cy = cytoscape({


      container: document.getElementById('cy'),

      elements: [
        { // node n1
          group: 'nodes', // 'nodes' for a node, 'edges' for an edge
          // NB the group field can be automatically inferred for you but specifying it
          // gives you nice debug messages if you mis-init elements

          // NB: id fields must be strings or numbers
          data: { // element data (put dev data here)
            id: 'COL3', // mandatory for each element, assigned automatically on undefined
            parent: 'C26', // indicates the compound node parent id; not defined => no parent
          },

          // scratchpad data (usually temp or nonserialisable data)
          scratch: {
            foo: 'bar'
          },

          position: { // the model position of the node (optional on init, mandatory after)
            x: 100,
            y: 100
          },

          selected: false, // whether the element is selected (default false)

          selectable: true, // whether the selection state is mutable (default true)

          locked: false, // when locked a node's position is immutable (default false)

          grabbable: true, // whether the node can be grabbed and moved by the user

          classes: 'foo bar' // a space separated list of class names that the element has
        },

        { // node n2
          data: {id: 'Oligomycina'},
          renderedPosition: {x: 200, y: 200} // can alternatively specify position in rendered on-screen pixels
        },

        { // node n3
          data: {id: 'Myriocin', parent: 'C26'},
          position: {x: 123, y: 234}
        },

        { // node nparent
          data: {id: 'C26', position: {x: 200, y: 100}}
        },

        { // edge e1
          data: {
            id: 'e1',
            // inferred as an edge because `source` and `target` are specified:
            source: 'Myriocin', // the source node id (edge comes from this node)
            target: 'Oligomycina',  // the target node id (edge goes to this node),
          }
        }
      ],

      layout: {
        name: 'preset',
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

    var toolDef = {
      position: 'right'
    };

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

  });
