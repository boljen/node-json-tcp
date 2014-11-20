var init = require('./../basic.js');

module.exports = function(session, inStream, outStream) {
  if (!outStream)
    outStream = inStream;

  init(inStream, outStream);
  inStream._parseMessage = session._in.bind(session);
  session._out = outStream.send.bind(outStream);
};
