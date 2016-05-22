'use strict';

angular.module('dnftestApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.selected = null;
    $scope.showOptions = false;
    $scope.dest = null;

    $scope.c = 3;

    // $http.get('/api/things').success(function(awesomeThings) {
    //   $scope.awesomeThings = awesomeThings;
    // });


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
            data: { id: 'Oligomycina' },
            renderedPosition: { x: 200, y: 200 } // can alternatively specify position in rendered on-screen pixels
          },

          { // node n3
            data: { id: 'Myriocin', parent: 'C26' },
            position: { x: 123, y: 234 }
          },

          { // node nparent
            data: { id: 'C26', position: { x: 200, y: 100 } }
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


    // $('#n1').cxtmenu({
    //   selector: 'node',
    //   commands: [
    //     {
    //       content: '<span class="icon-arrow-right"></span><label>Connect</label>',
    //       select: function(){
    //         $('#graph').cytoscapeEdgehandles('start', this.id());
    //       }
    //     },
    //
    //     {
    //       content: '<span class="icon-remove destructive-light"></span><label class="">Delete</label>',
    //       select: function(){
    //         doc.removeEntity( this.id() );
    //       }
    //     }
    //
    //   ]
    // });



    $scope.addNode =  function () {
      $scope.cy.add({
        group: "nodes",
        data: { id: "Lovastatin",  weight: 75 },
        position: { x: 250, y: 250 }
      });

      $scope.cy.add(
        { group: "edges", data: { id: "e3", source: "Lovastatin", target: "Oligomycina" }
        });

      $scope.cy.style()
        .selector('#Lovastatin')
        .style({
          'background-image': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Lovastatin.svg/2000px-Lovastatin.svg.png'
        })

        .update() // update the elements in the graph with the new style
      ;
    };



    // the default values of each option are outlined below:
    var defaults = {
      preview: true, // whether to show added edges preview before releasing selection
      stackOrder: 4, // Controls stack order of edgehandles canvas element by setting it's z-index
      handleSize: 10, // the size of the edge handle put on nodes
      handleColor: '#ff0000', // the colour of the handle and the line drawn from it
      handleLineType: 'ghost', // can be 'ghost' for real edge, 'straight' for a straight line, or 'draw' for a draw-as-you-go line
      handleLineWidth: 1, // width of handle line in pixels
      handleNodes: 'node', // selector/filter function for whether edges can be made from a given node
      hoverDelay: 150, // time spend over a target node before it is considered a target selection
      cxt: false, // whether cxt events trigger edgehandles (useful on touch)
      enabled: true, // whether to start the extension in the enabled state
      toggleOffOnLeave: false, // whether an edge is cancelled by leaving a node (true), or whether you need to go over again to cancel (false; allows multiple edges in one pass)
      edgeType: function( sourceNode, targetNode ) {
        // can return 'flat' for flat edges between nodes or 'node' for intermediate node between them
        // returning null/undefined means an edge can't be added between the two nodes
        return 'flat';
      },
      loopAllowed: function( node ) {
        // for the specified node, return whether edges from itself to itself are allowed
        return false;
      },
      nodeLoopOffset: -50, // offset for edgeType: 'node' loops
      nodeParams: function( sourceNode, targetNode ) {
        // for edges between the specified source and target
        // return element object to be passed to cy.add() for intermediary node
        return {};
      },
      edgeParams: function( sourceNode, targetNode, i ) {
        // for edges between the specified source and target
        // return element object to be passed to cy.add() for edge
        // NB: i indicates edge index in case of edgeType: 'node'
        return {};
      },
      start: function( sourceNode ) {
        // fired when edgehandles interaction starts (drag on handle)
      },
      complete: function( sourceNode, targetNodes, addedEntities ) {
        // fired when edgehandles is done and entities are added
      },
      stop: function( sourceNode ) {
        // fired when edgehandles interaction is stopped (either complete with added edges or incomplete)
      }
    };


    var toolDef = {
      position: 'right'
    };

    $scope.cy.edgehandles( defaults );

    // downloads the JSON data
    $scope.downloadIm = function () {
     var cy = $('#cy').cytoscape('get');
      $scope.cy = cy.json();
    };

    $scope.remove = function () {
      $scope.cy.$('#' + $scope.selected).remove();
      $scope.showOptions = false;
    };

    $scope.cy.on('tap', 'edge', function (evt) {
      $scope.selected = evt.cyTarget.id();
      $scope.showOptions = true;
      $scope.cy.$('#' + evt.cyTarget.id()).remove();
      $scope.$apply();
    });

    $scope.addEdge = function () {
      $scope.cy.add(
        { group: "edges", data: { id: "e" + parseInt($scope.c), source: $scope.selected, target: $scope.dest }
        });

      $scope.c ++;

      $scope.showOptions = false;
    }


    $scope.cy.$('#COL3').qtip({
      content: 'Hello, my name is COL3',
      position: {
        my: 'top center',
        at: 'bottom center'
      },
      style: {
        classes: 'qtip-bootstrap',
        tip: {
          width: 16,
          height: 8
        }
      }
    });


    $scope.bringBack = function () {

      $scope.cy.reset();

    };

    $scope.undo = function () {
      //$scope.cy.load();
    }

    /// init

    $('i, div')
      .popup()
    ;



  });
