var BSON = require('bson').BSONPure.BSON;

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

};
