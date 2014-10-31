/*var EventEmitter = require('events').EventEmitter;

function duplexSocketMock() {
  var socket = new EventEmitter();
  socket.write = function(bf) {
    this._d = bf;
    this.emit('readable');
  };
  socket.read = function() {
    var d = this._d || null;
    delete this._d;
    return d;
  };
  return socket;
}

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

describe('duplexSocketMock', function() {
  var socket;

  it('Should initialize', function() {
      socket = duplexSocketMock();
      (socket.write === undefined).should.be.false;
  });

  it('Should write and read', function(done) {
    socket.on('readable', function() {
      socket.read().should.equal('test');
      done();
    });
    socket.write('test');
  });

});
*/
