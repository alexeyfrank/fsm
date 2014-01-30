var FsmProxy = require('./fsm_proxy');
var Builder = require('./builder');

function Fsm() {}

Fsm.build = function(buildFn) {
  var proxy = new FsmProxy();
  buildFn(proxy);

  var builder = new Builder(proxy.getData());

  var fsm = new Fsm();
  builder.build(fsm);

  return fsm;
}

Fsm.prototype = {
  _runEvent: function(eventName) {
    var transitions = this._params.events[eventName];
    for (var i = 0, length = transitions.length; i < length; i++) {
      var from = transitions[i].from();
      if (from.indexOf(this.getState()) != -1) {
        this.setState(transitions[i].to);
        return;
      }
    }

    throw new Error('Cannot run event: ' + eventName);
  },

  _canRunEvent: function(eventName) {
    var transitions = this._params.events[eventName];
    if (typeof transitions == 'undefined') {
      return false;
    }

    for (var i = 0, length = transitions.length; i < length; i++) {
      var from = transitions[i].from();
      if (from.indexOf(this.getState()) != -1) {
        return true;
      }
    }
    return false;
  },

  can: function(eventName) {
    return this._canRunEvent(eventName);
  },

  run: function(eventName) {
    return this._runEvent(eventName);
  },

  setInitialState: function(newState) {
    this._context[this._stateField] = newState;
  },

  setState: function(newState) {
    var oldState = this.state;
    this._context[this._stateField] = newState;

    var transitions = this._params.afterTransitions;
    for (var i = 0, l = transitions.length; i < l; i++) {
      if (transitions[i].from().indexOf(oldState) != -1 && transitions[i].to().indexOf(newState) != -1) {
        var callback = transitions[i].callback;
        if (_.isString(callback)) {
          this._context[callback]();
        } else {
          callback.call(this._context);
        }
      }
    }
  },

  getState: function() {
    return this._context[this._stateField];
  },

  setContext: function(ctx) {
    this._context = ctx;
  },

  setStateField: function(fieldName) {
    this._stateField = fieldName;
  }
};

module.exports = Fsm;
