var FsmProxy = require('../../src/fsm_proxy');
var Builder = require('../../src/builder');

describe('FSM builder test suite', function() {
  var proxy;
  var builder;

  beforeEach(function() {
    var fsm = function(fsm) {
      fsm.initialState('new');
      fsm.state('new');
      fsm.state('disconnected');
      fsm.state('connected');

      fsm.event('connect', function() {
        fsm.transition('new', 'connected');
        fsm.transition('disconnected', 'connected');
      });

      fsm.event('disconnect', function() {
        fsm.transition('connected', 'disconnected');
      });
    };

    proxy = new FsmProxy();
    fsm(proxy);

    builder = new Builder(proxy.getData());
  });

  it('has valid events and transitions', function() {
    var fsm = builder.build({});

    expect(fsm.connect).toBeDefined();
    expect(fsm.disconnect).toBeDefined();
  });
});
