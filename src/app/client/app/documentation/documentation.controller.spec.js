'use strict';

describe('Controller: DocumentationCtrl', function () {

  // load the controller's module
  beforeEach(module('dnftestApp'));

  var DocumentationCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DocumentationCtrl = $controller('DocumentationCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
