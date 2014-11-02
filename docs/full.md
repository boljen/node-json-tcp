# Full Implementation (on top of basic)

The full implementation is built on top of the basic implementation and adds an
opinionated messaging and reply system on to

## Initialization

Initializing happens the same way as the basic implementation:

    jsonTcp.full(socket);

This will implement all the methods required and create an empty state object.

## State

You can manually attach a state object to the socket by adding it to the
initialization call.

    var yourStateObject = {
      authorized: false
    };

    jsonTcp.full(socket, yourStateObject)

If you ever need to access the state, you can call:

    var state = socket.getState();

## Sending a message

Sending a new message happens with the send command. It needs at least a message
type, and can take in data as well as a reply callback.

    /**
     * @param  {string} type
     * - The message type
     *
     * @param  {mixed} data
     * - (optional) data to be sent, can be almost anything
     *
     * @param  {function} replyCallback
     * - (optional) callback if you're expecting a reply
     */
    socket.send = function(type, data, replyCallback)

An example would be:

    // Send an authorization request
    clientSocket.send('authorize_request', 'pass', function(reply, state) {
      var data = reply.getData();
      if (data.success) {
        state.authorized = true;
      }
    });

## Message Types & Parsers

Every message has a type attached to it and you can attach functions to those
types.

    /**
     * @param {string} type
     * - The message type this parser applies to
     *
     * @param {function} parser
     * - The parser function itself
     *
     * @param {bool} overwrite
     * - If true, it will simply override a parser for a certain message.
     */
    socket.addParser = function(type, func, overwrite)
    socket.removeParser = function(type)
    socket.getParser = function(type)

Take our hypothetical example, lets add a parser to the server:

    serverSocket.addParser('authorize_request', function(message, state) {

      var passphrase = message.getData();
      if (passphrase === 'pass') {
        state.authorized = true;
      }

      message.reply({
        success: (passphrase === 'pass')
      });
    });

You can also add reply callbacks as the second argument when calling
message.reply() as it basically is socket.send but with the message reply type
pre-specified.

**Important: ** There's one reserved message type: 'reply'

## Unknown message type

When the socket receives a message type it doesn't has a parser for, it will
emit an "unknown_message" event. You can hook to that event and add a custom
handler.

    serverSocket.on('unknown_message', function(message) {
      message.reply({
        error: 'message_type_not_supported'
        type: message.getType()
      })
    });

So now the client gets back a reply

    clientSocket.send('non_existent', null, function(replyMessage) {
      var data = replyMessage.getData();
      if (data.error ==='message_type_not_supported') {
        console.log('Sending message type '+ data.type+' failed');
      }
    });

## Parser Bundles

Parser bundles are very useful as they allow you to group a list of message
parser and attach them to a socket with an O(1) algorithm. It also allows you to
easily share that object with other sockets.

Bundles are regular objects, take for example this bundle:

    var bundle = {
      // A message parser
      'get_user', function(message) {
          var id = message.getData();
          message.reply({
            id: id,
            username: 'boljen'
          });
      },

      // Another message parser
      'delete_user': function(message) {...}
    };

Now we can add that bundle to the socket

    serverSocket.addParserBundle(bundle);

Or remove it from  the socket if the need would arise

    serverSocket.removeParserBundle(bundle);

## Parser Lookup Order

The parser bundles are inside an array and when looking for a message parser,
the socket will iterate over that array and return the first parser found. The
order is quite simple; the order of the array:

    * Native bundle (socket.addParser adds to the native bundle)
    * First added parser bundle
    * Second added parser bundle
    * ...
    * Last added parser bundle
