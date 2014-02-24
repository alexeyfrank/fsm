var Fsm = require('../../src/fsm');

var fsmProto = Fsm.build(function(fsm) {
  fsm.initialState('parking');
  fsm.state('move');
  fsm.state('parking');

  fsm.event('move', function() {
    fsm.transition('parking', 'move')
  });

  fsm.event('park', function() {
    fsm.transition('move', 'parking');
  });
});

function Component() {
  this.fsm = Fsm.createFrom(fsmProto);
  this.fsm.setContext(this, 'state');
}

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
