var jsonTcp = require('./../')
  , EventEmitter = require('events').EventEmitter;

function duplexSocketMock() {

  var socket = new EventEmitter();

  socket.write = function(bf) {
    this._d = bf;
    socket.emit('readable');
  };

  socket.read = function() {
    var d = this._d;
    delete this._d;
    return d;
  };

  return socket;
}

describe('Basic Implementation', function() {
  this.timeout(50);

  var socket;

  it('Should bind', function() {
      socket = duplexSocketMock();
      jsonTcp.init(socket);
      (socket._parseMessage === undefined).should.be.false;
  });

  it('Should parse message', function(done) {
    var m = {test: true};
    socket.once('message', function(json) {
      json.should.equal(m);
      done();
    });
    socket._parseMessage(m);
  });

  it('Should send and receive data', function(done) {
    var m = {test: true};
    socket.once('message', function(json) {
      json.should.eql(m);
      done();
    });
    socket.send({
      test: true
    });

  });

  it('Should throw upon writing invalid data to send', function() {
    (function() {
      socket.send('test');
    }).should.throw();
  });

  it('Should emit ::error upon receiving invalid JSON', function(done) {

    socket = duplexSocketMock();
    jsonTcp.init(socket);

    socket.on('error', function(e) {
      done();
    });

    socket._d = new Buffer([0, 0, 0, 2, 1, 1]);
    socket.emit('readable');
  });

});
