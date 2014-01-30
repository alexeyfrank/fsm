function FsmProxy() {
  this._data = {
    states: {},
    events: {},
    afterTransitions: []
  };
}

FsmProxy.prototype.initialState = function(state) {
  this._data.initialState = state;
}

FsmProxy.prototype.state = function(state) {
  //TODO: fix to array
  this._data.states[state] = true;
}

FsmProxy.prototype.event = function(event, cb) {
  this._transitions = [];
  cb();
  this._data.events[event] = this._transitions;
}

FsmProxy.prototype.transition = function(from, to) {
  var fromFn = from;

  if (typeof from == 'string') { fromFn = function() { return [from]; } }
  if (Array.isArray(from)) { fromFn = function() { return from; } }

  this._transitions.push({ from: fromFn, to: to });
}

FsmProxy.prototype.afterTransition = function(from, to, action) {
  var fromFn = from;
  var toFn = to;

  if (typeof from == 'string') { fromFn = function() { return [from]; } }
  if (Array.isArray(from)) { fromFn = function() { return from; } }

  if (typeof to == 'string') { toFn = function() { return [to]; } }
  if (Array.isArray(to)) { toFn = function() { return to; } }

  this._afterTransitions.push({ from: from, to: to });
}

FsmProxy.prototype.all = function() {
  return this._data.states;
}

FsmProxy.prototype.without = function(states) {
  return function() {
    if (typeof states == 'string') { states = [states]; }

    return this._data.states.filter(function(state) {
      return states.indexOf(state) == -1;
    });
  }.bind(this);
}

FsmProxy.prototype.getData = function() {
  return this._data;
}

module.exports = FsmProxy;
