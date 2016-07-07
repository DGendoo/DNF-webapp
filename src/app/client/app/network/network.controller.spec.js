'use strict';

describe('Controller: NetworkCtrl', function () {

  // load the controller's module
  beforeEach(module('dnftestApp'));

  var NetworkCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NetworkCtrl = $controller('NetworkCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
