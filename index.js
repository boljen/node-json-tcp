var BSON = require('bson').BSONPure.BSON;
<<<<<<< HEAD
var Message = require('./message.js');

function deserializeStream(d, sock) {
  var res = [];
  var i = 0;
  try {
    while (i < d.length) {
        i =BSON.deserializeStream(d, i, 1, res, res.length);
    }
    return res;
  } catch(err) {
    var error = new Error('bson compileerror');
    error.code = 'BSON_PARSER';
    error.object = err;
    sock.emit('error', error, d, i);
    return [];
  }
};

module.exports = function(socket) {

  socket._replyId = 1;

  socket._parsers = {};

  socket._parserBundles = [];

  // Wrap the data event
  socket.on('data', function(d) {
    var data = deserializeStream(d);
    for (var i = 0; i < data.length; i++) {
      socket._parseMessage(data[i]);
    }
  });

  // Easy to overwrite without having to call an additional eventemitter
  socket._parseMessage = function(msg) {
    //console.log(msg);
    var messageObject = new Message(msg, socket);

    if (messageObject.invalid)
      return this.emit('error', new Error('invalid_message'), msg);

    if (messageObject.isReply()) {
      this.emit('r_'+messageObject.getReplyReceiver(), messageObject);
      return;
    } else {
      var type = messageObject.getType();
      var parser = this.getParser(type);

      if (parser === undefined) {
        this.emit('error',new Error('unknown message type: '+type));
      } else {
        parser(messageObject);
      }
    }

  };

  socket._send = function(json) {
    socket.write(BSON.serialize(json));
  };

  socket.send = function(type, data, reply, fromReply) {
    if (typeof type !== "string")
      throw new TypeError("Messagetype must be a string");

    var json = {
      t: type,
      d: data
    };

    if (reply) {
      json.r = this._replyId++;
      this.once('r_'+json.r, reply);
    }

    if (fromReply) {
      json.o = fromReply;
    }

    if (!fromReply && type==='reply')
      return;

    this._send(json);
  };

  socket.addParser = function(type, func, overwrite) {
    if (this._parsers[type] && !overwrite)
      throw new Error("Parser for type "+type+" already exists");
    this._parsers[type] = func;
  };

  socket.removeParser = function(type) {
    if (this._parsers[type])
      delete this._parsers[type];
  };

  socket.getParser = function(type) {
    if (this._parsers[type] !== undefined) {
      return this._parsers[type];
    } else {
      for (var i = 0; i <this._parserBundles.length; i++) {
        if (this._parserBundles[i][type] !== undefined) {
          return this._parserBundles[i][type];
        }
      }
      return undefined;
    }
  };

  socket.addParserBundle = function(bundle) {
    if (this._parserBundles.indexOf(bundle) === -1)
      this._parserBundles.push(bundle);
  };

  socket.removeParserBundle = function(bundle) {
    var i = this._parserBundles.indexOf(bundle);
    if (i > -1)
      this._parserBundles.splice(i, 1);
  };
=======

function deserializeStream(d) {
  var res = [];
  var i = 0;
  while (i < d.length) {
    i =BSON.deserializeStream(d, i, 1, res, res.length);
  }
  return res;
};

module.exports = function(sock) {

  sock.on('data', function(d) {
    var data = deserializeStream(d);
    for (var i = 0; i < data.length; i++) {
      sock.emit('message', data[i]);
    }
  });

  sock.send = function(json) {
    sock.write(BSON.serialize(json));
  };

  return sock;
>>>>>>> cfefee04ffa669f3219afa2fbd9f0af61c1d2a8b

};
