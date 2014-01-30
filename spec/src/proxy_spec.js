var FsmProxy = require('../../src/fsm_proxy');

describe('FSM proxy test suite', function() {
  var proxy;

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
    };

    proxy = new FsmProxy();

    fsm(proxy);
  });

  it('has valid events and transitions', function() {
    var data = proxy.getData();

    expect(data.initialState).toBe('new');
    expect(data.states['new']).toBeDefined();
    expect(data.states['connected']).toBeDefined();

    expect(data.events.connect[0].from()[0]).toBe('new');
    expect(data.events.connect[0].to).toBe('connected');

    expect(data.events.connect[1].from()[0]).toBe('disconnected');
    expect(data.events.connect[1].to).toBe('connected');
  });
});
