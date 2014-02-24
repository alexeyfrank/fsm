function Builder(params) {
  this._params = params;
}

Builder.prototype.build = function(fsm) {
  fsm._params = this._params;

  for (var eventName in this._params.events) {
    fsm[eventName] = (function(eventName) {
      return function() {
        this._runEvent(eventName);
      }
    }(eventName));
  }

  return fsm;
};


module.exports = Builder;
