/*var BSON = require('bson').BSONPure.BSON
  , Processor = require('buffer-to-messages');


module.exports = function(socket) {

  socket._p = new Processor(4, function(message) {
    try {
      var data = BSON.deserialize(message);
      socket._parseMessage(data);
    } catch (e) {
      socket.emit('error', e);
    }
  });

  socket.on('readable', function() {
    this._p.process(socket.read());
  });

  socket.send = socket._send = function(json) {
    var msg = BSON.serialize(json);
    this.write(this._p.createPrefix(msg));
    this.write(msg);
  };

  socket._parseMessage = function(msg) {
    this.emit('message', msg);
  };
};
*/
module.exports.AliasList = require('./aliaslist');
