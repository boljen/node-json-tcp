var BSON = require('bson').BSONPure.BSON;

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
    var error = new Error('bson compile error');
    error.code = 'INVALID_MESSAGE';
    error.buffer = d;
    error.bufferIndex = i;
    sock.emit('error', error, d, i);
    return [];
  }
};

var basic = module.exports.basic = function (socket) {

    socket.send = socket._send = function(json) {
      socket.write(BSON.serialize(json));
    };

    socket.on('data', function(d) {
      var data = deserializeStream(d, this);
      for (var i = 0; i < data.length; i++) {
        socket._parseMessage(data[i]);
      }
    });

    socket._parseMessage = function(msg) {
      this.emit('message', msg);
    };
};

module.exports.full = function(socket, state) {

  basic(socket);

  socket._replyId = 1;
  socket._parserBundles = [{}];

  if (state){
    socket._stateData = state;
  } else {
    socket._stateData = {};
  }

  socket._parseMessage = function(msg) {

    var messageObject = new Message(msg, socket);

    if (messageObject.invalid)
      return this.emit('error', new Error('invalid_message'), msg);

    if (messageObject.isReply()) {
      this.emit('r_'+messageObject.getReplyReceiver(),
                messageObject,
                socket._stateData,
                socket);
      return;
    } else {
      var type = messageObject.getType();
      var parser = this.getParser(type);

      if (parser === undefined) {
        this.emit('unknown_message', messageObject);
      } else {
        parser(messageObject,
              socket._stateData,
              socket);
      }
    }

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
    if (this._parserBundles[0][type] && !overwrite)
      throw new Error("Parser for type "+type+" already exists");
    this._parserBundles[0][type] = func;
  };

  socket.removeParser = function(type) {
    if (this._parserBundles[0][type])
      delete this._parsers[type];
  };

  socket.getParser = function(type) {
    for (var i = 0; i <this._parserBundles.length; i++) {
      if (this._parserBundles[i][type] !== undefined) {
        return this._parserBundles[i][type];
      }
    }
    return undefined;
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

  socket.getState = function() {
    return this._stateData;
  };

};
