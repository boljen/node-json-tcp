/*var jsonTcp = require('./../')
  , EventEmitter = require('events').EventEmitter

  , server, client;

function bridgedSocketMock() {
  var socket1, socket2;
  socket1 = new EventEmitter();
  socket2 = new EventEmitter();
  socket1._l = socket2;
  socket2._l = socket1;

  socket1.write = socket2.write = function(d) {
    this._l._d = d;
    this._l.emit('readable');
  };

  socket1.read = socket2.read = function() {
    var d= this._d || null;
    delete this._d;
    return d;
  };
  return [socket1, socket2];
}

function refreshSockets() {
  var socks = bridgedSocketMock();
  server = socks[0];
  client = socks[1];
}

describe('Full Implementation', function() {
  this.timeout(20);

  beforeEach(refreshSockets);

  describe('constructor', function() {

  });


});
*/
