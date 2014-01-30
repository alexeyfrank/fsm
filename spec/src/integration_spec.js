// var Component = require('../component');
var Fsm = require('../../src/fsm');

function Component() {
  this.fsm.setContext(this);
  this.fsm.setStateField('state');
}

Component.prototype = {
  fsm: Fsm.build(function(fsm) {
    fsm.initialState('parking');
    fsm.state('move');
    fsm.state('parking');

    fsm.event('move', function() {
      fsm.transition('parking', 'move')
    });

    fsm.event('park', function() {
      fsm.transition('move', 'parking');
    });
  })
};


describe('FSM integration test suite', function() {
  var component;

  beforeEach(function() {
    component = new Component();
  });

  it('transition to states', function() {
    expect(component.fsm.getState()).toBe('parking');
    component.fsm.move();
    expect(component.fsm.getState()).toBe('move');

  
  });

});
