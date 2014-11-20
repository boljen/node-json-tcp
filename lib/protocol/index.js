var init = require('./../basic.js');

module.exports = function(socket, session) {
  init(socket);
  socket._parseMessage = session._in.bind(session);
  session._out = socket.send.bind(socket);
};
