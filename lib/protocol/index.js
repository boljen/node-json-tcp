var init = require('./../basic.js');

module.exports = function(session, inStream, outStream) {
  if (!outStream)
    outStream = inStream;
    
  init(inStream, outStream);
  inStream._parseMessage = function(message) {
      session._in(message);
  };
  session._out = outStream.send.bind(outStream);
};
