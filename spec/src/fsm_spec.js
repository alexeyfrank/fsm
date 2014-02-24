var FsmProxy = require('../../src/fsm_proxy');
var Builder = require('../../src/builder');
var Fsm = require('../../src/fsm');

describe('FSM builder test suite', function() {
  var proxy;
  var builder;
  var fsm;

  beforeEach(function() {
    var buildFn = function(fsm) {
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
    buildFn(proxy);

    builder = new Builder(proxy.getData());

    fsm = new Fsm();
    builder.build(fsm);
    fsm.setContext({}, 'state');
  });

  it('has valid events and transitions', function() {
    expect(fsm.connect).toBeDefined();
    expect(fsm.disconnect).toBeDefined();

    expect(fsm.getState()).toBe('new');
    expect(fsm.can('connect')).toBe(true);
    expect(fsm.can('disconnect')).toBe(false);

    fsm.connect();
    expect(fsm.getState()).toBe('connected');
    expect(fsm.can('new')).toBe(false);
    expect(fsm.can('connect')).toBe(false);
    expect(fsm.can('disconnect')).toBe(true);

    fsm.disconnect();
    expect(fsm.getState()).toBe('disconnected');
    expect(fsm.can('new')).toBe(false);
    expect(fsm.can('connect')).toBe(true);
    expect(fsm.can('disconnect')).toBe(false);

    fsm.connect();
    expect(fsm.getState()).toBe('connected');
  });
});
