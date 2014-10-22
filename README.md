# json-tcp (NodeJS)

A JSON-based TCP communication protocol. It basically adds functionality to the
socket object.

## Install & getting started

    npm install json-tcp

    var jsonTcp = require('json-tcp');

## basic implementation

Initialize this by calling:

    jsonTcp.basic(socket);

Adds two things to your socket:

    // Send a message
    socket.send(jsonMessage);

    // Receive a message
    socket.on('message', function(jsonMessage) {
        // Your received json message
    });

An error event will be called when the received json message is invalid.

    socket.on('error', function(error) {
      if (error.code === 'INVALID_MESSAGE') {
        // error.buffer
        // error.bufferIndex
      }
    });

Adding your own custom implementation on top of this is quite easy:

    // Override this method with your own implementation
    socket._parseMessage = function(message) {
      this.emit('message', message);
    }

    // Remove or override this method with your own implementation
    socket.send = function(obj) {
      socket._send(obj);
    }

## full implementation

This adds another layer on top of the socket implementing a message system.

Note that the layer is the same in both the 'clientSocket' and 'serverSocket'

### Initialization

Initializing happens the same way as the basic implementation:

    jsonTcp.full(socket);

### Sending a message

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

    // Get data for user 1
    clientSocket.send('get_user', 1, function(replyMessage) {
      // Get the data
      console.log(replyMessage.getData())
    });

### Message Types

Every message type can have a parser. That function will be called when the
socket receives a new message of that type.

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

    // Also available
    socket.removeParser = function(type)
    socket.getParser = function(type)

Take our hypothetical example, lets add a parser:

    serverSocket.addParser('get_user', function(message) {
        var id = message.getData();
        message.reply({
          id: id,
          username: 'boljen',
          likes: 'NodeJS',
        });
    });

You can also add reply callbacks as the second argument when calling
message.reply()

### Unkown message type

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

### Parser Bundles

Parser bundles are very useful as they allow you to group a list of message
parser and attach them to a socket with an O(1) algorithm.

Take this bundle for example, implementing the same 'get_user' message type:

    var bundle = {
      'get_user', function(message) {
          var id = message.getData();
          message.reply({
            id: id,
            username: 'boljen',
            likes: 'NodeJS',
          });
      },

      'delete_user': function(message) {
        // ...
      }
    };

Now we can add that bundle to the socket when for example the connection has
gone through an authorization procedure.

    serverSocket.addParserBundle(bundle);

Or remove it from  the socket if the need would arise

    serverSocket.removeParserBundle(bundle);

### Parser Lookup Order

The parser bundles are inside an array and when looking for a message parser,
the socket will iterate over that array and return the first parser found. The
order is quite simple; the order of the array:

    * Native bundle (socket.addParser adds to the native bundle)
    * First added parser bundle
    * Second added parser bundle
    * ...
    * Last added parser bundle

### Socket State Data

In the example we only used the message object, but every message parser
  (including the reply parsers) are actually called with three arguments.

    function messageParser(message, state, socket)

While you can always get the latter two arguments through the message object,
  simply getting them the above way is more easy.

    clientSocket.send('authorize', 'passphrase', function(message, state) {
        if (message.getData().success === true) {
          state.authorized = true;
        }
    });

You can always attach a custom state object to the socket upon initialization:

    jsonTcp.full(socket, yourCustomStateObject)

### Todos

* Implement reply timeouts

## License

MIT
