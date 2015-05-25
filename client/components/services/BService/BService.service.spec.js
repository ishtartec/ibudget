'use strict';

describe('Service: BService', function () {

  // load the service's module
  beforeEach(module('budgetsApp'));

  // instantiate service
  var BService;
  beforeEach(inject(function (_BService_) {
    BService = _BService_;
  }));

  it('should do something', function () {
    expect(!!BService).toBe(true);
  });

});
