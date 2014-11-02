var BSON = require('bson').BSONPure.BSON
  , basic = require('./../basic')
  , Message = require('./message');


var Message = require('./message.js');

module.exports = function(socket, state) {

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
                null,
                messageObject,
                socket);
      return;
    } else {
      var type = messageObject.getType();
      var parser = this.getParser(type);

      if (parser === undefined) {
        this.emit('unknown_message', messageObject);
      } else {
        parser(messageObject,
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

      var to = setTimeout(function() {
        this.removeAllListeners('r_'+json.r);
      }, 5000);

      this.once('r_'+json.r, function() {
        clearTimeout(to);
        reply.apply(reply, arguments);
      });

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
