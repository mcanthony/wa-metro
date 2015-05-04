(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Metro = require('./lib/wa-metro.js');

var context = new AudioContext();
var cb = function (time, step) {
  var osc = context.createOscillator();
  osc.connect(context.destination);
  osc.start(time);
  osc.stop(time + 0.1);
};
var metro = new Metro(context, 16, cb);
metro.start();
},{"./lib/wa-metro.js":2}],2:[function(require,module,exports){
var interval = 50;
var tempo = 120;
var schedule_ahead = 0.9; // in think i seconds

var next_note_time = 0.0;
var resolution = 5;
var index = 1;
var workerFile = window.URL.createObjectURL(new Blob(['(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module \'"+o+"\'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){\nvar interval = 25;\nself.onmessage = function (event) {\n  if (event.data === \'interval\') {\n    interval = event.data.interval;\n  }\n  if (event.data === \'start\') {\n    console.log(\'worker starting\');\n    setInterval(function () {\n      postMessage(\'tick\');\n    }, interval);\n  }\n};\n},{}]},{},[1])'],{type:"text/javascript"}));

var callback = function (time, index) {
  console.log('callback');
};

function Metro(context, resolution, cb) {
  this.context = context;
  this.cb = cb;
  this.resolution = resolution;
  this._worker = new Worker(workerFile);
  var self = this;

  this._worker.onmessage = function (event) {
    if (event.data === 'tick') {
      self._scheduler();
    }
  };
}

Metro.prototype.start = function () {
  this._worker.postMessage({
    'interval': interval
  });
  this._worker.postMessage('start');
};

Metro.prototype._scheduler = function _scheduler() {

  while (next_note_time < this.context.currentTime + schedule_ahead) {
    this.cb(next_note_time, index);
    this._next();
  }
};

Metro.prototype._next = function _next() {
  index++;
  if (index > resolution) {
    index = 1;
  }
  console.log(next_note_time);
  next_note_time += ((60.0 / tempo) * 2) / resolution;
};

module.exports = Metro;
},{}]},{},[1]);
