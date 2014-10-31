# basic implementation

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
