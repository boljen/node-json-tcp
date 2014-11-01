var BSON = require('bson').BSONPure.BSON
  , Processor = require('buffer-to-messages');

module.exports = function (inStream, outStream) {

    if (!outStream)
      outStream = inStream;

    inStream._parseMessage = function(msg) {
      this.emit('message', msg);
    };

    inStream._p = new Processor(4, function(message) {
      try {
        var data = BSON.deserialize(message);
        inStream._parseMessage(data);
      } catch (e) {
        e.buffer = message;
        inStream.emit('error', e);
      }
    });

    inStream.on('readable', function() {
      this._p.process(socket.read());
    });

    outStream.send = socket._send = function(json) {
      var msg = BSON.serialize(json);
      this.write(this._p.createPrefix(msg));
      this.write(msg);
    };

};
